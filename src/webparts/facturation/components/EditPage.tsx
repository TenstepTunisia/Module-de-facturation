import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import styles from './Edit.module.scss';

interface ProjectResource {
  Id: string;
  Name: string;
  Group: string;
  Custom_x005f_39201ed87073ee11951900155d506629: string; // TVA
  Custom_x005f_4a514ada6873ee1181ac00155d50c319: string; // Prix de vente
}

const EditPage: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{ option: ProjectResource; quantity: number; }[]>([]);
  const [montantHT, setMontantHT] = useState<number>(0);
  const [tva, setTVA] = useState<number>(0);
  const [montantTTC, setMontantTTC] = useState<number>(0);
  const [showValues, setShowValues] = useState<boolean>(false);
  const [enregistrerDisabled, setEnregistrerDisabled] = useState<boolean>(false);
  const [articles, setArticles] = useState<ProjectResource[]>([]);

  useEffect(() => {
    axios.get("https://m365x12709499.sharepoint.com/sites/pwa/_api/ProjectServer/Projects('8c85e885-1770-ee11-b2bd-38fc983a2f68')/ProjectResources?$filter=Group eq 'Facturation'")
      .then(response => {
        const filteredResources = response.data.value.filter((resource: ProjectResource) => resource.Group === "Facturation");
        setArticles(filteredResources);
      })
      .catch(error => {
        console.error("There was an error fetching the articles!", error);
      });
  }, []);

  const incrementValue = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementValue = () => {
    setQuantity((prevQuantity) => (prevQuantity <= 1 ? 1 : prevQuantity - 1));
  };

  const enregistrerHandler = () => {
    const selectedArticle = articles.find((article: ProjectResource) => article.Name === selectedOption);
    if (selectedArticle) {
      setSelectedOptions([...selectedOptions, { option: selectedArticle, quantity }]);
    }
    setSelectedOption("");
    setQuantity(1);
    setEnregistrerDisabled(true);
  };

  const deleteRow = (index: number) => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);
    setMontantHT(0);
    setTVA(0);
    setMontantTTC(0);
    setShowValues(false);
  };

  const parsePrixVente = (prix: string) => {
    const numericPart = prix.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numericPart);
  };

  const calculateValues = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    selectedOptions.forEach(({ option, quantity }) => {
      const prixVente = parsePrixVente(option.Custom_x005f_4a514ada6873ee1181ac00155d50c319);
      const tva = parseFloat(option.Custom_x005f_39201ed87073ee11951900155d506629) / 100;
      const montantGlobal = prixVente * quantity;
      const montantTVA = montantGlobal * tva;
      const montantTTC = montantGlobal * (1 + tva);

      totalHT += montantGlobal;
      totalTVA += montantTVA;
      totalTTC += montantTTC;
    });

    setMontantHT(totalHT);
    setTVA(totalTVA);
    setMontantTTC(totalTTC);
    setShowValues(true);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.topcards}>
          <div className={styles.leftcard}>
            <div className={styles.label}>
              <label htmlFor="projet">Projet</label>
              <input type="text" id="projet" />
            </div>
            <div className={styles.label}>
              <label htmlFor="code">Code attachement</label>
              <input type="text" id="code" />
            </div>
            <div className={styles.label}>
              <label htmlFor="date">Date début</label>
              <input type="text" id="dae" />
            </div>
            <div className={styles.label}>
              <label htmlFor="tva">TVA</label>
              <input type="text" id="tva" />
            </div>
          </div>
          <div className={styles.rightcard}>
            <div className={styles.label}>
              <label htmlFor="operation">Opération</label>
              <input type="text" id="operation" />
            </div>
            <div className={styles.label}>
              <label htmlFor="attachement">Attachement</label>
              <input type="text" id="attachement" />
            </div>
            <div className={styles.label}>
              <label htmlFor="benificier">Bénificier</label>
              <input type="text" id="benificier" />
            </div>
            <div className={styles.label}>
              <label htmlFor="montant">Montant attachement</label>
              <input type="text" id="montant" />
            </div>
          </div>
        </div>
        <div className={styles.article}>
          <div className={styles.list}>
            <label htmlFor="article">Choisir un article:</label>
            <select
              id="article"
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setEnregistrerDisabled(false);
              }}
            >
              <option value="" disabled>
                Choisir un article
              </option>
              {articles.map((article) => (
                <option key={article.Id} value={article.Name}>
                  {article.Name}
                </option>
              ))}
            </select>
            <div className={styles.quantitypicker}>
              <button className="decrement" onClick={decrementValue}>
                -
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                min="1"
                step="1"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <button className="increment" onClick={incrementValue}>
                +
              </button>
            </div>
            <button onClick={enregistrerHandler} disabled={enregistrerDisabled}>Enregistrer</button>
          </div>
        </div>
        <div className={styles.lignearticle}>
          <h3>Lignes Articles</h3>
          {selectedOptions.length > 0 && (
            <button className={styles.enregistrerbutton} onClick={calculateValues}>Enregistrer</button>
          )}
          <div className={styles.secondtablewrapper}>
            <table className={styles.customtable}>
              <thead>
                <tr>
                  <th>Supprimer</th>
                  <th>Code article</th>
                  <th style={{ width: "300px" }}>Libelle article</th>
                  <th>Unité</th>
                  <th>Quantité article</th>
                  <th>TVA article</th>
                  <th>Prix de vente</th>
                  <th>Montant global</th>
                  <th>Montant TVA</th>
                  <th>Montant TTC</th>
                </tr>
              </thead>
              <tbody>
                {selectedOptions.map((item, index) => {
                  const prixVente = parsePrixVente(item.option.Custom_x005f_4a514ada6873ee1181ac00155d50c319);
                  const tva = parseFloat(item.option.Custom_x005f_39201ed87073ee11951900155d506629) / 100;
                  const montantGlobal = prixVente * item.quantity;
                  const montantTVA = montantGlobal * tva;
                  const montantTTC = montantGlobal * (1 + tva);

                  return (
                    <tr key={index}>
                      <td onClick={() => deleteRow(index)}><RiDeleteBin6Line /></td>
                      <td>{item.option.Id}</td>
                      <td>{item.option.Name}</td>
                      <td>{/* Unité */}</td>
                      <td>{item.quantity}</td>
                      <td>{(tva * 100).toFixed(2)}%</td>
                      <td>{formatNumber(prixVente)}</td>
                      <td>{formatNumber(montantGlobal)}</td>
                      <td>{formatNumber(montantTVA)}</td>
                      <td>{formatNumber(montantTTC)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={6}></td>
                  <td>Somme totale:</td>
                  <td>{formatNumber(montantHT)}</td>
                  <td>{formatNumber(tva)}</td>
                  <td>{formatNumber(montantTTC)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.checkout}>
            {showValues && (
              <div className={styles.details}>
                <span>Montant HT:</span>
                <span>{formatNumber(montantHT)}</span>
                <span>TVA:</span>
                <span>{formatNumber(tva)}</span>
                <span>Montant TTC:</span>
                <span>{formatNumber(montantTTC)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
