import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit } from "react-icons/fi";
import Navbar from './Navbar';
import SecondPage from './Secondpage';
import Popup from "./Popup";

import styles from './Facturation.module.scss';
import { sp } from '@pnp/sp/presets/all';
import { Web } from '@pnp/sp/webs';

const Facturation = ()=> {



  interface Task {
    TaskName: string;
    TaskStartDate: string;
    TaskFinishDate: string;
    TaskId: string ;
  }
  interface SecondTableRow {
    attachment: string;
    recap: string;
    idOperation: string;
    labelOperation: string;
    startDate: string;
    endDate: string;
    amount: string;
    expectedDate: string;
    executor: string;
    generalCount: string;
  }

  interface ProjectData {
    CodeOracle: string;
    ProjectName: string;
    Direction: string;
    ProjectStartDate: string;
    ProjectFinishDate: string;
    PO: string;
    Montant: string;
    Périodedegarantie: string;
  }

  const [showPopup, setShowPopup] = useState<boolean>(true); 
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedStatus, setCheckedStatus] = useState<boolean[]>([]);
  const [showSecondPage, setShowSecondPage] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('8c85e885-1770-ee11-b2bd-38fc983a2f68');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [secondTableRows, setSecondTableRows] = useState<SecondTableRow[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');


  const siteUrl = "https://m365x12709499.sharepoint.com/sites/pwa";
  useEffect(() => {
  
    sp.setup({
      sp: {
        baseUrl: siteUrl
      }
    });

    const fetchProjectData = async () => {
      try {
        const url = `https://m365x12709499.sharepoint.com/sites/Pwa/_api/ProjectData/[en-US]/Projects(guid'${selectedProjectId}')`;
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json;odata=verbose'
          }
        });
        const data = response.data.d;
        setProjectData({
          CodeOracle: data.CodeOracle,
          ProjectName: data.ProjectName,
          Direction: data.Direction,
          ProjectStartDate: data.ProjectStartDate,
          ProjectFinishDate: data.ProjectFinishDate,
          PO: data.PO,
          Montant: data.Montant,
          Périodedegarantie: data.Périodedegarantie
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
        if (error.response) {
          // Server responded with a status other than 200 range
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // Request was made but no response was received
          console.error('Request data:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
        }
        console.error('Config:', error.config);
      }
    };


    fetchProjectData();

  

   
    // Fetch tasks
    const fetchTasks = async () => {
      if (!selectedProjectId) return;
    
      try {
        const url = `https://m365x12709499.sharepoint.com/sites/pwa/_api/ProjectData/[en-US]/Projects(guid'${selectedProjectId}')/Tasks?$filter=TaskIsMilestone eq false&$select=TaskId,TaskName,ParentTaskName,TaskStartDate,TaskFinishDate`;
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json;odata=verbose'
          }
        });
        const data = response.data;
    
        // To remove duplicates
        const seenTaskNames = new Set();
        const uniqueTasks = data.d.results.filter((item: any) => {
          const taskName = item.ParentTaskName;
          if (seenTaskNames.has(taskName)) {
            return false;
          } else {
            seenTaskNames.add(taskName);
            return true;
          }
        }).map((item: any) => ({
          TaskName: item.ParentTaskName,
          TaskStartDate: ticksToDate(item.TaskStartDate),
          TaskFinishDate: ticksToDate(item.TaskFinishDate),
          TaskId: item.TaskId,
        }));
    
        console.log("uniqueTasks", uniqueTasks);
        setTasks(uniqueTasks);
    
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    
    fetchTasks();
    


  }, [selectedProjectId]);
    
  
  
    const handleCheckboxChange = async (index: number): Promise<void> => {
      const newCheckedStatus: boolean[] = [...checkedStatus];
      newCheckedStatus[index] = !newCheckedStatus[index];
      setCheckedStatus(newCheckedStatus);
    
      const checkedTask = tasks[index];
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    
      setSecondTableRows(prevRows => [...prevRows, {
        attachment: '',
        recap: '',
        idOperation: checkedTask.TaskId,
        labelOperation: checkedTask.TaskName,
        startDate: checkedTask.TaskStartDate,
        endDate: checkedTask.TaskFinishDate,
        amount: '',
        expectedDate: '',
        executor: '',
        generalCount: '',
      }]);
    
      setLoading(true);
      const subsiteUrl = "https://m365x12709499.sharepoint.com/sites/pwa/Conseillers%20TPME";
      const web = Web(subsiteUrl);
    try {
      const list = web.lists.getByTitle('Listes_donnees_operations');
      console.log('List reference obtained', list);

      const response = await list.items.add({
        taskId: checkedTask.TaskId,
        TaskStartDate: ticksToDate(checkedTask.TaskStartDate),
        TaskFinishDate: ticksToDate(checkedTask.TaskFinishDate),
        operation: checkedTask.TaskName,
      });

      console.log('Task posted to the list successfully', response);
    } catch (error) {
      console.error('Error details:', error);
      if (error.response && error.response.status === 404) {
        console.error('List not found. Please check the list name and site URL.');
      } else {
        console.error('Error posting task to the list:', error);
      }
    } finally {
      setLoading(false);
    }
    };
   
    
    const handleClosePopup = (): void => {
      setShowPopup(false);
    };
  
    const handleButtonClick = (operation: string) => {
      setSelectedOperation(operation);
      setSelectedProject(projectData?.ProjectName || '');
      setShowSecondPage(true);
    };
  
    if (showSecondPage) {
      return <SecondPage operation={selectedOperation} project={selectedProject} />;
    }
  
    const handleProjectChange = (projectId: string) => {
      setSelectedProjectId(projectId);
    };
 

    const ticksToDate = (ticks: string): string => {
      const milliseconds = parseInt(ticks.replace("/Date(", "").replace(")/", ""), 10);
      const date = new Date(milliseconds);
      return date.toLocaleDateString(); // Adjust the date format according to your preference
    };
    return (
      <div>
      <Navbar onProjectChange={handleProjectChange} />
 
       <div>
          {showPopup && <Popup onClose={handleClosePopup} />}
     
     
          
      <div className={styles.container}>
      <div className={styles.topcards}>
            <div className={styles.leftcard}>
              <div className={styles.label}>
                <label htmlFor="code">Code</label>
                <input type="text" id="code" value={projectData?.CodeOracle || ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="projet">Projet</label>
                <input type="text" id="projet" value={projectData?.ProjectName || ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="direction">Direction</label>
                <input type="text" id="direction" value={projectData?.Direction || ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="date-debut">Date début</label>
                <input type="text" id="date-debut" value={projectData ? ticksToDate(projectData.ProjectStartDate) : ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="date-fin">Date fin</label>
                <input type="text" id="date-fin" value={projectData ? ticksToDate(projectData.ProjectFinishDate) : ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="po">PO</label>
                <input type="text" id="po" value={projectData?.PO || ''} readOnly />
              </div>
            </div>
            <div className={styles.rightcard}>
              <div className={styles.label}>
                <label htmlFor="montant-global">Montant global attachement</label>
                <input type="text" id="montant-global" value={projectData?.Montant ? Number(projectData.Montant).toFixed(0) : ''} readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="montant-contractuel">Montant contractuel</label>
                <input type="text" id="montant-contractuel"  />
              </div>
              <div className={styles.label}>
                <label htmlFor="reception-prov">Réception prov(%)</label>
                <input type="text" id="reception-prov" value='' readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="reception-def">% Réception Def</label>
                <input type="text" id="reception-def" value='' readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="periode-garantie">Période garantie</label>
                <input type="text" id="periode-garantie" value={projectData?.Périodedegarantie ? `${Number(projectData.Périodedegarantie).toFixed(0)} J` : ''}  readOnly />
              </div>
              <div className={styles.label}>
                <label htmlFor="tva">TVA</label>
                <input type="text" id="tva" value='' readOnly />
              </div>
            </div>
          </div>
 
       <div className={styles.bottomcard}>
         <h5>Ensembles des opérations de votre échéancier (Enregistrer votre opération pour commencer le traitement des attachements)</h5>
     
         <table className={styles.customtable}>
           <thead>
             <tr>
               <th>Num</th>
               <th>Libellé opération</th>
               <th>Date début</th>
               <th>Date fin</th>
               <th>Date prévue réception Prov</th>
               <th>Exécuteur</th>
               <th>Enregistrement</th>
             </tr>
           </thead>
           <tbody>
           {tasks.map((task, index) => (
               <tr key={index}>
               <td>{index + 1}</td>
               <td>{task.TaskName}</td>
               <td>{task.TaskStartDate}</td>
               <td>{task.TaskFinishDate}</td>
               <td>{task.TaskFinishDate}</td> 
               <td></td> 
               <td>
              
                   <input
                    type="checkbox"
                    id={`task-checkbox-${task.TaskId}`}
                    className={styles.customCheckbox}
                    checked={checkedStatus[index] || false}
                    onChange={() => handleCheckboxChange(index)}
                  />
             
          
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
 
       <div className="loading-container">
             {loading && <div className="loading-icon"></div>}
           </div>
      
           {!loading && checkedStatus.some((checked) => checked) && (
                         <div className="second-table-wrapper">
                             <h5>Ensembles des opérations à traiter</h5>
                             <table className={styles.customtable}>
                                 <thead>
                                     <tr>
                                         <th>Attachement</th>
                                         <th>Recap</th>
                                         <th>Id Operation</th>
                                         <th>Libellé Operation</th>
                                         <th>Date debut</th>
                                         <th>Date fin</th>
                                         <th>Montant</th>
                                         <th>Date prevu reception pov</th>
                                         <th>Exécuteur</th>
                                         <th>Décompte général</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {secondTableRows.map((row, index) => (
                                         <tr key={index}>
                                   <td>
               
                 <div>
      
                 <button onClick={() => handleButtonClick(row.labelOperation)}>
           <FiEdit style={{ fontSize: '18px' }} />
         </button>
       {/* )} */}
     </div>
               </td>
                                             <td>{row.recap}</td>
                                             <td>{row.idOperation}</td>
                                             <td>{row.labelOperation}</td>
                                             <td>{row.startDate}</td>
                                             <td>{row.endDate}</td>
                                             <td>{row.amount}</td>
                                             <td>{row.expectedDate}</td>
                                             <td>{row.executor}</td>
                                             <td>{row.generalCount}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     )}
                     </div>
                     <div className="loading-container second-page">
   {/* {loadingSecondPage && <div className="loading-icon"></div>} */}
 </div>
     </div>
     {/* <div>
   <h2>List Data:</h2>
   <ul>
     {
     listData.map((item, index) => (
       <li key={index}></li>
     ))}
   </ul>
 </div> */}
       </div>
       </div>
     
   );
 };

export default Facturation ;