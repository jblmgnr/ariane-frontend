import { useSelector } from "react-redux";
import { showObject } from "../modules/util";
import { Gender } from "../modules/common";

const memberWidth = 210;
const memberHeight = 210;
const hSpaceBetweenGroup = 100;
const hSpaceBetweenMembers = 30;
const vSpaceBetweenMembers = 50;
const vExternalMargin = 50;
const hExternalMargin = 50;

// Custom hook : useTree()
//======================================================
export function useTree() {
  // Reducers
  const user = useSelector((state) => state.user.value);
  const members = useSelector((state) => state.members.value);

  function log(a = "", b = "", c = "", d = "", e = "", f = "") {
    console.log(a, b, c, d, e, f);
  }

  function printMember(
    member,
    title = "============================================"
  ) {
    if (!member) {
      console.log("\u001b[41mprintMember (null)\u001b[0m");
      return;
    }
    if (title.length > 0) console.log("\u001b[7m", title, "\u001b[0m");
    console.log(
      member.gender == Gender.male ? "\u001b[46m" : "\u001b[45m",
      "ID       : ",
      String(member._id).slice(-3)
    );
    const f = fatherOf(member);
    const m = motherOf(member);
    const p = partnerOf(member);
    console.log(
      "Name      : ",
      member.lastName,
      member.firstName,
      "(",
      member.nickName,
      ")"
    );
    console.log("Blood     : ", member.sameBlood ? "TRUE" : "FALSE");
    console.log("Job       : ", member.job);
    console.log("Father    : ", f ? f.firstName : f);
    console.log("Mother    : ", m ? m.firstName : m);
    console.log("Partner   : ", p ? p.firstName : p);
    console.log("BirthCity : ", member.birthCity ? member.birthCity.name : "-");
    console.log("Photo     : ", member.photo);
    console.log("\u001b[0m");
  }

  // Return Graphic Representation of the tree from members list
  //=============================================================
  function buildReps() {
    let graphDef = {
      width: 0,
      height: 0,
      boxWidth: memberWidth,
      boxHeight: memberHeight,
      nodes: [],
    };

    // return graphDef;

    log("Total members : ", members.length);
    if (!members.length) {
      log("No members found !!!");
      return graphDef;
    }

    const generations = distributeByGeneration();

    log(" FOUND ", generations.length + " generations");
    let genNb = 0;
    for (let gen of generations) {
      log("========================================== Gen " + genNb);
      for (let m of gen) {
        log(" - " + m._id + " " + m.firstName);
      }
      genNb++;
    }

    // return graphDef;
    genNb = 0;
    // For each generation, gather members with same ascendants
    const groupedGen = [];
    for (const gen of generations) {
      // TODO Did : Ici, il faudrait trie les gen par birthDate
      // Group members by same parents
      log(
        " \u001b[31m   Group by same parents for gen  " + genNb++ + "\u001b[0m"
      );
      const groups = groupBySameParentsAndInsertPartners(gen);
      log(" ======= groups");
      log(groups);
      groupedGen.push(groups);
      let gNb = 0;

      for (let g of groups) {
        log("  Group[" + gNb + "]");
        for (let m of g.members) log("   = " + m.firstName);
        gNb++;
      }
    }

    for (let x = 0; x < groupedGen.length; x++) {
      const gen = groupedGen[x];
      log("gen " + x + " contains " + gen.length + " groups ...");
      for (let y = 0; y < gen.length; y++) {
        const group = gen[y];
        for (let z = 0; z < group.members.length; z++) {
          const member = group.members[z];
          log(
            "   Gen " + x + " Group: " + y + "  Member : " + member.firstName
          );
        }
      }
    }

    graphDef = convertsGenrationArrayIntoNodeArray(graphDef, groupedGen);

    // log(graphDef);

    return graphDef;
  }

  // Organise each group of generation by parent and by partner
  function groupBySameParentsAndInsertPartners(gen) {
    const groups = [];
    if (gen.length === 0) return groups;

    const firstFather = fatherOf(gen[0]);
    // log("First father : ", firstFather);

    // First group is the group of the first father found.
    groups.push({ father: fatherOf(gen[0]), members: [gen[0]] });

    const toBeAssociatedWithPartner = [];

    // If 2 members shares at least mother or father, they are in the same group
    for (let i = 1; i < gen.length; i++) {
      const m = gen[i];
      const father = fatherOf(m);

      if (father != null) {
        // Group using parent, only available for Root members or if they have a parent
        const existingGroup = groups.find((e) => e.father === father);
        if (existingGroup) existingGroup.members.push(m);
        else groups.push({ father: father, members: [m] });
      } else {
        toBeAssociatedWithPartner.push(m);
      }
    }

    // Now, insert the member just after ist partner if the appropriate group
    for (const m of toBeAssociatedWithPartner) {
      const partner = partnerOf(m);
      if (partner === null) {
        log(
          "It seems that's member " +
            m.firstName +
            " has no relation with any one ! It will be ignored"
        );
        continue;
      }

      log(
        "Suppose to find partner " +
          partner.firstName +
          " to organize " +
          m.firstName
      );

      const groupOfPartner = groups.find((e) => e.members.includes(partner));
      if (!groupOfPartner) {
        console.error(
          "Should find partner if one of these groups. Member is ignored"
        );
        continue;
      }

      const indexOfPartner = groupOfPartner.members.findIndex(
        (m) => m._id === partner._id
      );
      log("Should insert " + m.firstName + " after index " + indexOfPartner);
      groupOfPartner.members.splice(indexOfPartner + 1, 0, m);
    }

    return groups;
  }

  // Returns an array of members per generation
  //===========================================
  function distributeByGeneration() {
    // let toDispatch = [...members];

    let toDispatch = members.filter((m) => {
      if (!fatherOf(m) && !motherOf(m) && !isRoot(m) && !partnerOf(m)) {
        console.log(
          ` \u001b[101m${m.firstName} is removed from tree since it has no relations with any one.\u001b[0m`
        );
        return false;
      }
      return true;
    });

    let genNb = 0;
    const generations = [];

    let previousGeneration = [];
    while (toDispatch.length > 0) {
      log(
        " \u001b[31m========== Process Generation " +
          genNb +
          "=== still to dispatch : " +
          toDispatch.length +
          "=============\u001b[0m"
      );
      for (let item of toDispatch)
        console.log(" Still to dispatch : ", item.firstName, item._id);

      if (genNb > 5) {
        console.log("\u001b[33m ARGGG stop an inifite loop !!!!!\u001b[0m");
        return generations;
      }
      let directChildren = [];
      // Dispatch members by generation
      for (const m of toDispatch) {
        log("Member: ", m.firstName);

        if (isMemberDirectChildOfAnyOfList(m, previousGeneration)) {
          directChildren.push(m);
        }
      }

      toDispatch = toDispatch.filter((e) => !directChildren.includes(e));

      let linkToDirectChildren = [];
      for (const m of toDispatch) {
        log("Member: ", m.firstName);

        if (isMemberParternOfAnyInList(m, directChildren)) {
          linkToDirectChildren.push(m);
        }
      }

      log(
        "\u001b[1m  >>>>>>>>>>>>>>>>>>>>>>>>> Result of generation : " +
          genNb +
          "\u001b[0m"
      );
      log(" By parents ...");
      for (let i of directChildren)
        log("  \u001b[35m - " + i.firstName + " \u001b[0m");
      log(" By Link ...");
      for (let i of linkToDirectChildren)
        log("  \u001b[34m - " + i.firstName + " \u001b[0m");

      currentGeneration = directChildren.concat(linkToDirectChildren);

      toDispatch = toDispatch.filter((e) => !currentGeneration.includes(e));
      previousGeneration = [...currentGeneration];

      log(" \u001b[32mAdd a new Generation : " + genNb + "\u001b[0m");
      generations.push(currentGeneration);

      currentGeneration = [];
      genNb++;
    }

    console.log(
      "\u001b[33m Well the generation has been successfully found \u001b[0m"
    );

    return generations;
  }

  // Return wether the given member has a mother, father ot is partner
  // to a member of the given list
  function isMemberDirectChildOfAnyOfList(member, list) {
    // log(
    //   "Test if " + member.firstName + " is direct child to any members of "
    // );
    // for (let i of list) log(" - " + i.firstName);

    if (list === null || list.length === 0) {
      const value = isRoot(member);
      // log("                      ROOT  " + value);
      return value;
    }

    for (let candidat of list) {
      if (motherOf(member) === candidat || fatherOf(member) === candidat) {
        // log(
        //   "      \u001b[35m YES a link found for  \u001b[0m" + member.firstName
        // );
        return true;
      }
    }

    log("No parent found for " + member.firstName);
    return false;
  }

  // Return wether the given member has a mother, father or partner
  // to a member of the given list
  function isMemberParternOfAnyInList(member, list) {
    // log(
    //   "Test if " + member.firstName + " is linked to any members of "
    // );
    // for (let i of list) log(" - " + i.firstName);

    if (list === null || list.length === 0) {
      const value = isRoot(member);
      // log(" GEN 0 --------------------------->>>>  " + value);
      return value;
    }

    for (let candidat of list) {
      if (partnerOf(member) === candidat) {
        // log(
        //   "      \u001b[35m YES a link found for  \u001b[0m" + member.firstName
        // );
        return true;
      }
    }

    log(" No partner found for " + member.firstName);
    return false;
  }

  // Return y origin corrdinate for given generation index (start at 0)
  function yOriForGeneration(genNb) {
    return vExternalMargin + genNb * (vSpaceBetweenMembers + memberHeight);
  }

  function convertsGenrationArrayIntoNodeArray(graphDef, groupedGen) {
    let biggestGeneration = 0;
    let maxNumber = 0;
    for (let genNb = 0; genNb < groupedGen.length; genNb++) {
      let memberNb = 0;
      for (let g of groupedGen[genNb]) {
        memberNb += g.members.length;
      }

      log("Gen " + genNb + " has " + memberNb + " members");
      if (memberNb > maxNumber) {
        biggestGeneration = genNb;
        maxNumber = memberNb;
      }
    }

    log("Biggest generation is " + biggestGeneration);

    // Compute max horizontal space from biggest group
    computeMaxCanvasDimensionFromGeneration(
      groupedGen[biggestGeneration],
      graphDef,
      groupedGen.length
    );

    // Create node in graph def
    //--------------------------
    for (let gen = 0; gen < groupedGen.length; gen++) {
      const yOri = yOriForGeneration(gen);
      let xOri = hExternalMargin;
      let xOriShift = 0; // To be centered to the parent
      for (const group of groupedGen[gen]) {
        for (const member of group.members) {
          log(" Build node for " + member.firstName);

          if (!member.partner) xOri += hSpaceBetweenMembers;
          else xOri -= hSpaceBetweenMembers;
          // if (xOriShift === 0) {
          //   const father = fatherOf(member);
          //   if (father) {
          //     const nodeFather = nodeOfMember(father);
          //     if (nodeFather) {
          //       // Here we can center child to to their parent.
          //       log(
          //         "Try to center chid ",
          //         member.firstName,
          //         " under ",
          //         father.firstName
          //       );
          //       xOriShift = nodeFather.x + memberWidth;
          //       log(
          //         "Add ",
          //         xOriShift,
          //         "to Ceneter child",
          //         member.firstName
          //       );
          //     }
          //   }
          // }
          let node = {
            x: xOri + xOriShift,
            y: yOri,
            name: member.firstName,
            member: member,
          };

          xOri += memberWidth;
          // showObject(node);
          graphDef.nodes.push(node);
        }
        xOri += hSpaceBetweenGroup;
      }
    }

    return graphDef;

    function nodeOfMember(member) {
      return graphDef.nodes.find((e) => e.member._id === member._id);
    }
  }

  // Update width and height properties in graphDef with maximum dimension of
  // draw area according to number of member horizontaly and number of generation
  // verticaly.
  function computeMaxCanvasDimensionFromGeneration(gen, graphDef, genCount) {
    // Compute max horizontal space from biggest group
    const groupCount = gen.length;

    log("Group count : ", groupCount);
    log("Generation count ", genCount);
    graphDef.width = 0;
    for (let group of gen) {
      const memberCount = group.members.length;
      graphDef.width +=
        memberCount * memberWidth + (memberCount - 1) * hSpaceBetweenMembers;
    }
    graphDef.width += groupCount * hSpaceBetweenGroup + 2 * hExternalMargin;

    graphDef.height =
      genCount * memberHeight +
      (genCount - 1) * vSpaceBetweenMembers +
      2 * vExternalMargin;
  }

  // Return wether the member is root
  //---------------------------------
  function isRoot(member) {
    // log("  Test if member " + member.firstName + " is root ");
    // showObject(member);
    if (member === null || member === undefined) {
      console.error("Null or Undefined member");
      return false;
    }

    // log(
    //   " ???? member " + member.firstName + " has parent : " + hasParent(member)
    // );
    if (!hasParent(member)) {
      // log("No mother and father, test if it has link");
      if (!partnerOf(member)) {
        // log(
        //   "\u001b[31m YYYYYYYYESSSSSSS \u001b[0m, member " +
        //     member.firstName +
        //     " is ROOT"
        // );
        return true;
      }
      log("   Test the link ", member.partner);

      return isRoot(partnerOf(member));
    }
    return false;
  }

  // Return list of direct children of given member
  function directChildrenOf(member, addPartnerOnes = true) {
    const children = members.filter(
      (e) => e.father === member._id || e.mother === member._id
    );

    if (!addPartnerOnes) return children;

    const partner = partnerOf(member);
    if (!partner) return children;

    const childrenOfPartner = members.filter(
      (e) => e.father === partner._id || e.mother === partner._id
    );

    for (let c of childrenOfPartner)
      if (!children.includes(c)) children.push(c);
    return children;
  }

  // Return member with given id
  //-----------------------------
  function memberOfId(id, log_error = false) {
    // console.warn(" memberOfId " + id);
    const found = members.find((m) => m._id == id);

    // console.warn("ID FOUND : ", found);
    if (found) return found;
    if (log_error) {
      console.error("No member exists with id ", id + " in list ");
      for (let i of members) log(i._id, i.firstName);
    }

    return null;
  }

  function hasParent(m) {
    return hasMother(m) || hasFather(m);
  }

  function hasMother(m) {
    return m.mother !== null && m.mother !== undefined;
  }
  function hasFather(m) {
    return m.father !== null && m.father !== undefined;
  }

  function motherOf(m) {
    if (!hasMother(m)) return null;
    return memberOfId(m.mother);
  }
  function fatherOf(m) {
    if (!hasFather(m)) return null;
    return memberOfId(m.father);
  }

  function fatherFirstNameOf(m) {
    const father = fatherOf(m);
    return father ? father.firstName : "";
  }

  function partnerOf(m, bijonctif = false) {
    const directPartnerId = m.partner;
    if (directPartnerId === null || directPartnerId === undefined)
      if (!bijonctif) return null;

    const directPartner = memberOfId(directPartnerId, false);
    if (!bijonctif || directPartner) return directPartner;

    return members.find((e) => e.partner === m._id);
  }

  return {
    buildReps,
    partnerOf,
    memberOfId,
    motherOf,
    hasMother,
    fatherOf,
    hasFather,
    hasParent,
    isRoot,
    printMember,
    directChildrenOf,
    fatherFirstNameOf,
  };
}
