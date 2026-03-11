/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all   subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {

   const votes = {};
   const registeredVoters= new Set();
   const votedVoters = new Set();
     
    for (let candidate of candidates) {
    votes[candidate.id] = 0;
  }
  function registerVoter(voter) {
    if (
      !voter ||
      typeof voter.id === "undefined" ||
      voter.age < 18 ||
      registeredVoters.has(voter.id)
    ) {
      return false;
    }
    registeredVoters.add(voter.id);
    return true;
  }

  function castVote(voterId, candidateId, onSuccess, onError){

    if(!registeredVoters.has(voterId)){
      return ("Voter has not registered");
    }
    if(!(candidateId in votes)){
      return ("Cnadidate does not exist");
    }
    if(votedVoters.has(voterId)){
      return onError("Voter has already voted");
    }

    votes[candidateId]++;
    votedVoters.add(voterId);
    return onSuccess({ voterId, candidateId });
  }
 
   function getResults(sortFn) {
    const results = candidates.map(c => ({
      id: c.id,
      name: c.name,
      party: c.party,
      votes: votes[c.id]
    }));
    
    if (sortFn) {
      results.sort(sortFn);
    } else {
      results.sort((a, b) => b.votes - a.votes);
    }

    return results;
  }
  function getWinner() {
    let maxVotes = 0;
    let winner = null;

    for (let candidate of candidates) {
      const candidateVotes = votes[candidate.id];

      if (candidateVotes > maxVotes) {
        maxVotes = candidateVotes;
        winner = candidate;
      }
    }

    if (maxVotes === 0) return null;
    return winner;
  }
  return {
    registerVoter,
    castVote,
    getResults,
    getWinner
  };
}

export function createVoteValidator(rules) {
   return function(voter){

       if (!voter || typeof voter !== "object") {
      return { valid: false, reason: "Invalid voter object" };
    }

    for (let field of rules.requiredFields) {
      if (!(field in voter)) {
        return { valid: false, reason: `${field} is required` };
      }
    }
    if (voter.age < rules.minAge) {
      return { valid: false, reason: "Voter under minimum age" };
    }
    return { valid: true, reason: "Valid voter" };
  };
}

export function countVotesInRegions(regionTree) {
  
  if (!regionTree || typeof regionTree !== "object") {
    return 0;
  }

  let total = regionTree.votes || 0;
  if (Array.isArray(regionTree.subRegions)) {
    for (let sub of regionTree.subRegions) {
      total += countVotesInRegions(sub);
    }
  }
  return total;
}

export function tallyPure(currentTally, candidateId) {

  const newTally = { ...currentTally };

  if (newTally[candidateId]) {
    newTally[candidateId] += 1;
  } else {
    newTally[candidateId] = 1;
  }
  return newTally;
}
