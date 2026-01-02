import React, { useEffect } from "react";
import { useState } from "react";
import "./Trash.css";

// interface TrashItem {
//   id: number;
//   name: string;
//   date: string;
//   filePath: string;
// }
interface TrashItem {
  docId: number;
  deleted: number;
  docName: string;
  docSize: string;
  docUploadDate: string;
  documentType: string;
  filePath: string;
}

const TrashPage: React.FC = () => {
   const [trashList, setTrashList] = useState<TrashItem[]>([]);

   const trash_api = "http://localhost:8080/api/documents/trash/1";

   useEffect(() => {
      const fetchTrash = async () => {
        try {
        const trash_response = await fetch(trash_api);

      if (!trash_response.ok) {
        throw new Error("fetching trash failed....");
      }

      const data: TrashItem[] = await trash_response.json();
      console.log("Trash Fetched (data):", data);

      setTrashList(data);
      } catch (error) {
        console.error(error);
      }
      }

      fetchTrash();
   },[])

  return (
    <div className="trash-page">
        <div>
          <h2>Welcome to DMS</h2>

        <select>
            <option value="Home">Trash 1</option>
            <option value="Reacent">Trash 2</option>
            <option value="Trash">Trash 3</option>
        </select>

        <table className="table table-sm"  style={{color:'#f1fcfd'}}>
          <thead style={{backgroundColor: '#f1fcfd', color: 'white'}}>
            <tr>
                <th>Name</th>
                <th>date</th>
                <th>filePath</th>
            </tr>
          </thead>
           <tbody>
          {trashList.length === 0 ? (
            <tr>
              <td colSpan={3}>No deleted documents</td>
            </tr>
          ) : (
            trashList.map((item: TrashItem) => (
              <tr key={item.docId} className="tr_tag ">
                <td>{item.docName}</td>
                <td>{new Date(item.docUploadDate).toLocaleString()}</td>
                <td>{item.filePath}</td>
              </tr>
            ))
          )}
        </tbody>
        </table>
        </div>
    </div>
  );
}
export default TrashPage;