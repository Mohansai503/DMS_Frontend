import React from "react";
import { useState } from "react";
import "./Trash.css";

interface TrashItem {
  id: number;
  name: string;
  date: string;
  filePath: string;
}

const TrashPage: React.FC = () => {
   const [trashList, setTrashList] = useState<TrashItem[]>([])
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
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.date}</td>
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