const { showObject, showObjects } = require("./util");
import { RelationShip } from "./common";

const memberWidth = 180;
const memberHeight = 180;
const hSpaceBetweenGroup = 100;
const hSpaceBetweenMembers = 30;
const vSpaceBetweenMembers = 50;
const vExternalMargin = 50;
const hExternalMargin = 50;

function log(a, b, c, d, e, f) {
  return;
  console.log(a, b, c, d, e, f);
}
// Return Graphic Representation of the tree from members list
//=============================================================
function buildReps(members) {
  let graphDef = {
    width: 0,
    height: 0,
    boxWidth: memberWidth,
    boxHeight: memberHeight,
    nodes: [],
  };

  log("Total members : ", members.length);
  if (!members.length) {
    log("No members found !!!");
    return graphDef;
  }

  const generations = distributeByGeneration(members);

  log(" FOUND ", generations.length + " generations");
  let genNb = 0;
  for (let gen of generations) {
    log("========================================== Gen " + genNb);
    for (let m of gen) {
      log(" - " + m._id + " " + m.firstName);
    }
    genNb++;
  }

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
        log("   Gen " + x + " Group: " + y + "  Member : " + member.firstName);
      }
    }
  }

  graphDef = convertsGenrationArrayIntoNodeArray(groupedGen);

  log(graphDef);

  return graphDef;

  function convertsGenrationArrayIntoNodeArray(groupedGen) {
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
      log("Y ori", yOri);
      let xOri = hExternalMargin;
      let xOriShift = 0; // To be centered to the parent
      for (const group of groupedGen[gen]) {
        for (const member of group.members) {
          log(" Build node for " + member.firstName);

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

          xOri += memberWidth + hSpaceBetweenMembers;
          showObject(node);
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

  // Return y origin corrdinate for given generation index (start at 0)
  function yOriForGeneration(genNb) {
    return vExternalMargin + genNb * (vSpaceBetweenMembers + memberHeight);
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

  // Organise each group of generation by parent and by partner
  function groupBySameParentsAndInsertPartners(gen) {
    const groups = [];
    if (gen.length === 0) return groups;

    const firstFather = fatherOf(gen[0]);
    log("First father : ", firstFather);

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
  function distributeByGeneration(members) {
    let toDispatch = [...members];
    let genNb = 0;
    const generations = [];

    let previousGeneration = [];
    while (toDispatch.length > 0) {
      log(
        " \u001b[1m========== Process Generation " +
          genNb +
          "================\u001b[0m"
      );
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

        if (isMemberLinkToList(m, directChildren)) {
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
      // log("AFter remove element");
      // log(toDispatch.length);
      // for (let i of toDispatch) log(" - " + i.firstName);

      previousGeneration = [...currentGeneration];

      log(" \u001b[32mAdd a new Generation : " + genNb + "\u001b[0m");
      generations.push(currentGeneration);

      currentGeneration = [];
      genNb++;
    }

    return generations;

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

      log("No link found for " + member.firstName);
      return false;
    }

    // Return wether the given member has a mother, father or partner
    // to a member of the given list
    function isMemberLinkToList(member, list) {
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

      log("No link found for " + member.firstName);
      return false;
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
        if (!hasPartner(member)) {
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
  function hasPartner(m) {
    return m.partner !== null && m.partner !== undefined;
  }

  function motherOf(m) {
    if (!hasMother(m)) return null;
    return memberOfId(m.mother);
  }
  function fatherOf(m) {
    if (!hasFather(m)) return null;
    return memberOfId(m.father);
  }
  function partnerOf(m) {
    if (!hasPartner(m)) return null;
    return memberOfId(m.partner);
  }

  // Return member with given id
  //-----------------------------
  function memberOfId(id, log_error = true) {
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
}

function parentOf(member) {}

module.exports = { buildReps };
