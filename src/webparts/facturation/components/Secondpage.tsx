import React, { useState } from "react";
import Navbar from "./Navbar";
import { MdOpenInBrowser } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import UpdatePage from "./UpdatePage";
import styles from "./SecondPage.module.scss";
import EditPage from "./EditPage";


interface SecondPageProps {
    operation: string;
    project: string;
  }
  const SecondPage: React.FC<SecondPageProps> = ({ operation, project }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [attachment, setAttachment] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditPage, setShowEditPage] = useState<boolean>(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);

  const handleSaveAttachment = () => {
    const newRow = {
      edit: <MdOpenInBrowser />,
      up: <FaRegEdit />,
      num: "",
      id: "",
      code: "",
      attach: attachment,
      date: "",
      montant: "",
      tva: "",
      nbClient: "",
      client: "",
      beneficier: "",
      utilisateur: "",
      facture: "",
      dateFact: "",
      appel: "",
      croquis: "",
      pat: "",
      pvRp: "",
    };
    setTableData([...tableData, newRow]);
    setAttachment("");
  };

  const handleEditClick = (index: number) => {
    setCurrentRowIndex(index);
    setShowModal(true);
  };

  const updateRow = (updatedRow: any) => {
    if (currentRowIndex !== null) {
      const newTableData = [...tableData];
      newTableData[currentRowIndex] = updatedRow;
      setTableData(newTableData);
      setShowModal(false);
      setCurrentRowIndex(null);
    }
  };

//   const NavigateToUpdate = () => {
//     setShowModal(true); 
//   };

  const NavigateToEdit = () => {
    setShowEditPage(true); 
  };

  return (
    <div>
      <Navbar />
      <div>
        {/* Render EditPage if showEditPage is true */}
        {showEditPage && <EditPage />}
        
     
        {!showEditPage && (
          <>
              <div className={styles.divs}>
      <div className={styles.card}>
        <h4>Operation:</h4>
        <span className={styles.value}>{operation}</span>
      </div>
      <div className={styles.card}>
        <h4>Projet:</h4>
        <span className={styles.value}>{project}</span>
      </div>
      <div className={styles.card}>
        <h4>Montant global des attachements:</h4>
        <span className={styles.value}></span>
      </div>
    </div>

            <div className={styles.inputsection}>
              <label htmlFor="attachment">Saisir un attachement </label>
              <input
                type="text"
                id="attachment"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              />
              <button onClick={handleSaveAttachment}>Enregistrer</button>
            </div>

            <div className={styles.tablewrapper}>
              <h5>Lignes Attachements</h5>

              <table className={styles.customtable}>
                <thead>
                  <tr>
                    <th>Edit</th>
                    <th>UP</th>
                    <th>Num</th>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Attach</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>TVA</th>
                    <th>Nb Client</th>
                    <th>Client</th>
                    <th>Beneficier</th>
                    <th>Utilisateur</th>
                    <th>Facture</th>
                    <th>Date fact</th>
                    <th>Appel</th>
                    <th>Croquis</th>
                    <th>Pat</th>
                    <th>PV RP</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td>
                     <button
                    className={`${styles.icon} ${styles['button-icon']}`} 
                    onClick={NavigateToEdit}
                  >
                          <MdOpenInBrowser style={{ fontSize: "23px" }} />
                            </button>
                            </td>
                              <td>
                        <button
                    className={`${styles['button-icon']}`} 
                    onClick={() => handleEditClick(index)}
                  >
                    <FaRegEdit style={{ fontSize: "18px" }} />
                  </button>
                      </td>
                      <td>{row.num}</td>
                      <td>{row.id}</td>
                      <td>{row.code}</td>
                      <td>{row.attach}</td>
                      <td>{row.date}</td>
                      <td>{row.montant}</td>
                      <td>{row.tva}</td>
                      <td>{row.nbClient}</td>
                      <td>{row.client}</td>
                      <td>{row.beneficier}</td>
                      <td>{row.utilisateur}</td>
                      <td>{row.facture}</td>
                      <td>{row.dateFact}</td>
                      <td>{row.appel}</td>
                      <td>{row.croquis}</td>
                      <td>{row.pat}</td>
                      <td>{row.pvRp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <UpdatePage
              showModal={showModal}
              setShowModal={setShowModal}
              currentRow={currentRowIndex !== null ? tableData[currentRowIndex] : null}
              updateRow={updateRow}

            />
          </>
        )}
      </div>
    </div>
  );
};

export default SecondPage;
