import React, { useState } from "react";

export interface NewFolderModalProps {
  onCancel: () => void;
  onCreate: (name: string) => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({
  onCancel,
  onCreate,
}) => {
  const [folderName, setFolderName] = useState("");

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>New Folder</h3>

        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttons}>
          <button onClick={onCancel}>Cancel</button>

          <button
            onClick={() => {
              if (folderName.trim()) {
                onCreate(folderName);
                setFolderName("");
              }
            }}
            style={styles.createBtn}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;


const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: 20,
    width: 300,
    borderRadius: 8,
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 10,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 15,
  },
  createBtn: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
};
