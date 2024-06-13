import React from 'react';
import styles from './Popup.module.scss'; 

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className={styles.popupoverlay}>
      <div className={styles.popup}>
        <h2>Bienvenue dans le module de facturation</h2>
        <p>Bonjour,</p>
        <p>Ce module comporte 4 phases:</p>
        <ul>
          <li>Les ensembles des opérations à traiter.</li>
          <li>Chaque opération comporte 1 à plusieurs attachements selon votre choix.</li>
          <li>Chaque attachement comporte des ensembles d'articles de facture.</li>
          <li>Chaque attachement passe par une approbation de la direction avec le mot Attacher (Oui, Non, Validé).</li>
        </ul>
        <p>Vous pouvez modifier les données de chaque Attachement si votre attachement est encore 'Non', sinon votre attachement est fixé.</p>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Popup;
