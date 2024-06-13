import React, { useState, useEffect } from "react";
import styles from "./Update.module.scss";

interface UpdatePageProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    currentRow: any;
    updateRow: (updatedRow: any) => void;
}

const UpdatePage: React.FC<UpdatePageProps> = ({ showModal, setShowModal, currentRow, updateRow }) => {

    const [formState, setFormState] = useState<any>(currentRow || {});

    useEffect(() => {
        setFormState(currentRow || {});
      }, [currentRow]);


    const closeModal = () => {
        setShowModal(false);
    };

    // Function to handle form submission
   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateRow(formState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

    return (
        <div>
            {showModal && (
                <div className={styles.modal}> {/* Apply modal style */}
                    <div className={styles.modalcontent}> {/* Apply modal content style */}
                        <span className={styles.close} onClick={closeModal}>
                            &times;
                        </span>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputcontainer}>
                                <label htmlFor="code">Code:</label>
                                <input
                                type="text"
                                id="code"
                                name="code"
                                value={formState.code || ""}
                                onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="attach">Attachment:</label>
                                <input
                                type="text"
                                id="attach"
                                name="attach"
                                value={formState.attach || ""}
                                onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="date">Date:</label>
                                <input
                                type="date"
                                id="date"
                                name="date"
                                value={formState.date || ""}
                                onChange={handleChange}
                                />      
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="nbClient">Nombre client:</label>
                                <input
                                    type="number"
                                    id="nbClient"
                                    name="nbClient"
                                    value={formState.nbClient || ""}
                                    onChange={handleChange}
                                    />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="client">Client:</label>
                                <input
                                    type="text"
                                    id="client"
                                    name="client"
                                    value={formState.client || ""}
                                    onChange={handleChange}
                                    />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="beneficier">Bénéficier:</label>
                                <input
                                    type="text"
                                    id="beneficier"
                                    name="beneficier"
                                    value={formState.beneficier || ""}
                                    onChange={handleChange}
                                    />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="utilisateur">Utilisateur:</label>
                                <input
                                    type="text"
                                    id="utilisateur"
                                    name="utilisateur"
                                    value={formState.utilisateur || ""}
                                    onChange={handleChange}
                                    />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="facture">Facture:</label>
                                <input
                                        type="number"
                                        id="facture"
                                        name="facture"
                                        value={formState.facture || ""}
                                        onChange={handleChange}
                                        />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="datefac">DateFact:</label>
                                <input
                                        type="date"
                                        id="dateFact"
                                        name="dateFact"
                                        value={formState.dateFact || ""}
                                        onChange={handleChange}
                                        />
                            </div>
                            <div className={styles.inputcontainer}> {/* Apply input container style */}
                                <label htmlFor="appel">Appel:</label>
                                <input
                                    type="text"
                                    id="appel"
                                    name="appel"
                                    value={formState.appel || ""}
                                    onChange={handleChange}
                                    />
                            </div>
                            <button className={styles.button} type="submit">Enregistrer</button>
                            <button className={styles.button} type="button" onClick={closeModal}>Annuler</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatePage;
