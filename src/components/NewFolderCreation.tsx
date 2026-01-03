import React, { useState } from "react";
import NewFolderModal from "./NewFolderModal";

interface Folder {
  id: number;
  name: string;
}

const EmptyPage: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);

  const handleCreateFolder = (name: string) => {
    setFolders([...folders, { id: Date.now(), name }]);
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      {folders.length === 0 && (
        <div style={styles.emptyBox}>
          <div
            style={styles.plus}
            onClick={() => setShowMenu(!showMenu)}
          >
            +
          </div>
          <p>New</p>

          {showMenu && (
            <div style={styles.menu}>
              <div
                style={styles.menuItem}
                onClick={() => {
                  setShowMenu(false);
                  setShowModal(true);
                }}
              >
                📁 New Folder
              </div>
              <div style={styles.menuItem}>📄 File Upload</div>
            </div>
          )}
        </div>
      )}

      {folders.length > 0 && (
        <div>
          <h3>Your Folders</h3>
          {folders.map((folder) => (
            <div key={folder.id} style={styles.folder}>
              📁 {folder.name}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <NewFolderModal
          onCancel={() => setShowModal(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  );
};

export default EmptyPage;


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  emptyBox: {
    textAlign: "center",
    position: "relative",
  },
  plus: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "2px solid #000",
    fontSize: 40,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    width: 160,
  },
  menuItem: {
    padding: 10,
    cursor: "pointer",
  },
  folder: {
    padding: 8,
    width: 200,
    borderBottom: "1px solid #ddd",
  },
};
