// Modified Navbar Component
import React from 'react' ;
// import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';
// import axios from 'axios';


interface NavbarProps {
  onProjectChange?: (projectId: string) => void;
}
export interface Project {
  id: string;
  name: string;
}
const Navbar: React.FC<NavbarProps> = ({ onProjectChange }) => {
  // const [projects, setProjects] = useState<Project[]>([]);
  // const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const url = 'https://m365x12709499.sharepoint.com/sites/demopwa/_api/ProjectData/[en-US]/Projects';
  //       const response = await axios.get(url, {
  //         headers: {
  //           Accept: 'application/json;odata=verbose'
  //         }
  //       });
  //       const data = response.data;
  //       const fetchedProjects: Project[] = data.d.results.map((item: any) => ({
  //         id: item.ProjectId,
  //         name: item.ProjectName
  //       }));
  //       setProjects(fetchedProjects);
  //     } catch (error) {
  //       console.error('Error fetching projects:', error);
  //     }
  //   };

  //   fetchProjects();
  // }, []);

  // const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const projectId = event.target.value;
  //   setSelectedProjectId(projectId);
  //   if (onProjectChange) {
  //     onProjectChange(projectId);
  //   }
  // };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarlogo}>
        <img src={require('../assets/logo2.png')} alt="" />
      </div>
      <div className={styles.navTitle}>
        <a href="/" className={styles.navlink}>Suivi et facturation</a>
      </div>
      {/* <div>
        <select value={selectedProjectId} onChange={handleProjectChange} className={styles.dropdown}>
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div> */}
    </nav>
  );
};

export default Navbar;
