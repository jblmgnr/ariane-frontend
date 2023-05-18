const {
  collapseTextChangeRangesAcrossMultipleVersions,
  canHaveDecorators,
} = require("typescript");
const { showObject, showObjects } = require("./util");

function buildReps(members) {
  console.log("Total members : ", members.length);

  let toDispatch = [...members];

  console.log("Members to dispatch : ", toDispatch.length);
  let genNb = 0;
  const generations = [];

  let previousGeneration = [];
  while (toDispatch.length > 0) {
    console.log(
      " ========== Process Generation " + genNb + "============================"
    );
    let currentGeneration = [];
    // Dispatch members by generation
    for (const m of toDispatch) {
      console.log("Member: ", m.firstName);

      if (isMemberLinkToList(m, previousGeneration)) {
        currentGeneration.push(m);
      }
    }

    console.log("  ------------ Result of generation ----------- " + genNb);
    for (let i of currentGeneration)
      console.log("  \u001b[35m - " + i.firstName + " \u001b[0m");

    toDispatch = toDispatch.filter((e) => !currentGeneration.includes(e));
    console.log("AFter remove element");
    console.log(toDispatch.length);
    for (let i of toDispatch) console.log(" - " + i.firstName);

    previousGeneration = [...currentGeneration];

    generations.push(currentGeneration);
    currentGeneration = [];
    genNb++;
  }

  genNb = 0;
  for (let gen of generations) {
    console.log("======= Gen " + genNb);
    for (let m of gen) {
      console.log(" - " + m.firstName);
    }
    genNb++;
  }

  // Return wether the given member has a mother, father ot is linked
  // to a member of the given list
  function isMemberLinkToList(member, list) {
    console.log(
      "Test if " + member.firstName + " is linked to any members of "
    );
    for (let i of list) console.log(" - " + i.firstName);

    if (list === null || list.length === 0) {
      const value = isRoot(member);
      console.log(" GEN 0 --------------------------->>>>  " + value);
      return value;
    }

    for (let candidat of list) {
      if (
        motherOf(member) === candidat ||
        fatherOf(member) === candidat ||
        linkOf(member) === candidat
      ) {
        console.log(
          "      \u001b[35m YES a link found for  \u001b[0m" + member.firstName
        );
        return true;
      }
    }

    console.log("No link found for " + member.firstName);
    return false;
  }

  // Return wether the member is root
  //---------------------------------
  function isRoot(member) {
    console.log("  Test if member " + member.firstName + " is root ");
    // showObject(member);
    if (member === null || member === undefined) {
      console.error("Null or Undefined member");
      return false;
    }

    console.log(
      " ???? member " + member.firstName + " has parent : " + hasParent(member)
    );
    if (!hasParent(member)) {
      console.log("No mother and father, test if it has link");
      if (!hasLink(member)) {
        console.log(
          "\u001b[31m YYYYYYYYESSSSSSS \u001b[0m, member " +
            member.firstName +
            " is ROOT"
        );
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
