/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getIntervenants } from "../services/intervenants";

const Intervenants = () => {
  const [intervenants, setIntervenants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIntervenants();
      setIntervenants(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Liste des Intervenants</h2>
      <ul>
        {intervenants.map((intervenant: any) => (
          <li key={intervenant._id}>
            {intervenant.nom} {intervenant.prenom} - {intervenant.poste}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Intervenants;