import { useState, useEffect } from 'react';
import { searchGithub} from '../api/API';
import Candidates from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidates[]>([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true); 
      try {
        const result = await searchGithub(); 
        setCandidates(result);
      } catch (error) {
        setMessage('Error fetching candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []); 

  const handleAccept = () => {
    const acceptedCandidate = candidates[currentCandidateIndex];
    setMessage(`Candidate ${acceptedCandidate.name} accepted.`);
    nextCandidate();
  };

  const nextCandidate = () => {
    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    } else {
      setMessage('No more candidates.');
    }
  };

  // If no candidates are available, render a message
  if (candidates.length === 0) {
    return <p>No candidates found.</p>;
  }

  return (
    <div>
      <h1>Candidate Search</h1>
      {loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p>{message}</p>
      ) : (
        <div>
          <div>
            <img 
              src={candidates[currentCandidateIndex].avatar} 
              alt={candidates[currentCandidateIndex].name} 
            />
            <h2>{candidates[currentCandidateIndex].name}</h2>
            <p>Username: {candidates[currentCandidateIndex].userName}</p>
            <p>Location: {candidates[currentCandidateIndex].location}</p>
            <p>Company: {candidates[currentCandidateIndex].company}</p>
            <p>Bio: {candidates[currentCandidateIndex].bio}</p>
          </div>
          <button onClick={handleAccept}>Save +</button>
          <button onClick={nextCandidate}>Skip -</button>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
