const { showObject, showObjects } = require("./util");

// Return Graphic Representation of the tree from members list
//=============================================================
function buildReps(members) {
  console.log("Total members : ", members.length);

  const generations = distributeByGeneration(members);

  console.log(" FOUND ", generations.length + " generations");
  let genNb = 0;
  for (let gen of generations) {
    console.log("========================================== Gen " + genNb);
    for (let m of gen) {
      console.log(" - " + m.firstName);
    }
    genNb++;
  }

  // For each generation, gather members with same ascendants
  for (const gen of generations) {
  }
}

// Returns an array of members per generation
//===========================================
function distributeByGeneration(members) {
  let toDispatch = [...members];
  let genNb = 0;
  const generations = [];

  let previousGeneration = [];
  while (toDispatch.length > 0) {
    console.log(
      " \u001b[1m========== Process Generation " +
        genNb +
        "================\u001b[0m"
    );
    let directChildren = [];
    // Dispatch members by generation
    for (const m of toDispatch) {
      console.log("Member: ", m.firstName);

      if (isMemberDirectChildOfAnyOfList(m, previousGeneration)) {
        directChildren.push(m);
      }
    }

    toDispatch = toDispatch.filter((e) => !directChildren.includes(e));

    let linkToDirectChildren = [];
    for (const m of toDispatch) {
      console.log("Member: ", m.firstName);

      if (isMemberLinkToList(m, directChildren)) {
        linkToDirectChildren.push(m);
      }
    }

    console.log(
      "\u001b[1m  >>>>>>>>>>>>>>>>>>>>>>>>> Result of generation : " +
        genNb +
        "\u001b[0m"
    );
    console.log(" By parents ...");
    for (let i of directChildren)
      console.log("  \u001b[35m - " + i.firstName + " \u001b[0m");
    console.log(" By Link ...");
    for (let i of linkToDirectChildren)
      console.log("  \u001b[34m - " + i.firstName + " \u001b[0m");

    currentGeneration = directChildren.concat(linkToDirectChildren);

    toDispatch = toDispatch.filter((e) => !currentGeneration.includes(e));
    // console.log("AFter remove element");
    // console.log(toDispatch.length);
    // for (let i of toDispatch) console.log(" - " + i.firstName);

    previousGeneration = [...currentGeneration];

    console.log(" \u001b[32mAdd a new Generation : " + genNb + "\u001b[0m");
    generations.push(currentGeneration);

    currentGeneration = [];
    genNb++;
  }

  return generations;

  // Return wether the given member has a mother, father ot is linked
  // to a member of the given list
  function isMemberDirectChildOfAnyOfList(member, list) {
    // console.log(
    //   "Test if " + member.firstName + " is direct child to any members of "
    // );
    // for (let i of list) console.log(" - " + i.firstName);

    if (list === null || list.length === 0) {
      const value = isRoot(member);
      // console.log("                      ROOT  " + value);
      return value;
    }

    for (let candidat of list) {
      if (motherOf(member) === candidat || fatherOf(member) === candidat) {
        // console.log(
        //   "      \u001b[35m YES a link found for  \u001b[0m" + member.firstName
        // );
        return true;
      }
    }

    console.log("No link found for " + member.firstName);
    return false;
  }

  // Return wether the given member has a mother, father ot is linked
  // to a member of the given list
  function isMemberLinkToList(member, list) {
    // console.log(
    //   "Test if " + member.firstName + " is linked to any members of "
    // );
    // for (let i of list) console.log(" - " + i.firstName);

    if (list === null || list.length === 0) {
      const value = isRoot(member);
      // console.log(" GEN 0 --------------------------->>>>  " + value);
      return value;
    }

    for (let candidat of list) {
      if (linkOf(member) === candidat) {
        // console.log(
        //   "      \u001b[35m YES a link found for  \u001b[0m" + member.firstName
        // );
        return true;
      }
    }

    console.log("No link found for " + member.firstName);
    return false;
  }

  // Return wether the member is root
  //---------------------------------
  function isRoot(member) {
    // console.log("  Test if member " + member.firstName + " is root ");
    // showObject(member);
    if (member === null || member === undefined) {
      console.error("Null or Undefined member");
      return false;
    }

    // console.log(
    //   " ???? member " + member.firstName + " has parent : " + hasParent(member)
    // );
    if (!hasParent(member)) {
      // console.log("No mother and father, test if it has link");
      if (!hasLink(member)) {
        // console.log(
        //   "\u001b[31m YYYYYYYYESSSSSSS \u001b[0m, member " +
        //     member.firstName +
        //     " is ROOT"
        // );
        return true;
      }
      console.log("   Test the link ", member.linked);

      return isRoot(linkOf(member));
    }
    return false;
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
  function hasLink(m) {
    return m.linked !== null && m.linked !== undefined;
  }

  function motherOf(m) {
    if (!hasMother(m)) return null;
    return memberOfId(m.mother);
  }
  function fatherOf(m) {
    if (!hasFather(m)) return null;
    return memberOfId(m.father);
  }
  function linkOf(m) {
    if (!hasLink(m)) return null;
    return memberOfId(m.linked);
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
      for (let i of members) console.log(i._id, i.firstName);
    }

    return null;
  }
}

function parentOf(member) {}

module.exports = { buildReps };
