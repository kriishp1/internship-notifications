import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobsArray, setJobArray] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8000/homepage");
      setJobArray(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Internship data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      {jobsArray.map((j, index) => (
        <div key={index} className="job-card">
          <h3>{j.title}</h3>
          {/* <p>Position: {j.title}</p>
          <p>Location:  {j.preferred_common_name}</p> */}
          <br />
        </div>
      ))}
    </>
  );
}

export default App;
