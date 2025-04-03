import { useState, useEffect } from 'react';
import { searchGithub } from '../api/API'; 
import Candidates from '../interfaces/Candidate.interface'; 

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidates[]>([]);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [savedCandidates, setSavedCandidates] = useState<Candidates[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch candidates
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

  // Handle saving a candidate
  const handleSavedCandidates = () => {
    const newSavedCandidates = [...savedCandidates, candidates[currentCandidateIndex]];
    setSavedCandidates(newSavedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(newSavedCandidates));
    setMessage(`Candidate ${candidates[currentCandidateIndex].name} saved.`);
    nextCandidate(); 
  };

  
  const nextCandidate = () => {
    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
      setMessage('');
    } else {
      setMessage('No more candidates.');
    }
  };

 
  const handleSkip = () => {
    nextCandidate();
  };

  
  const currentCandidate = candidates[currentCandidateIndex];

  // If no candidates are available, render a message
  if (candidates.length === 0) {
    return <p>No candidates found.</p>;
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {message && <p>{message}</p>} {/* Show message if any */}
          
          {currentCandidate ? (
            <div>
              <div>
                <img
                  src={currentCandidate.avatar}
                  alt={currentCandidate.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                <h2>{currentCandidate.name}</h2>
                <p>Username: {currentCandidate.userName}</p>
                <p>Location: {currentCandidate.location}</p>
                <p>Company: {currentCandidate.company}</p>
                <p>Bio: {currentCandidate.bio}</p>
                <p>Email: {currentCandidate.email}</p>
              </div>
              <button onClick={handleSavedCandidates}>Save +</button>
              <button onClick={handleSkip}>Skip -</button>
            </div>
          ) : (
            <p>No more candidates to show.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;

