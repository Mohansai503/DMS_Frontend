import { FiSearch, FiSliders } from "react-icons/fi";
import "./searchBar.css";
import type { ChangeEventHandler } from "react";

interface SearchBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFilterClick?: () => void;
}

const SearchBar = ({value = '', onChange = () => {}, onFilterClick }: SearchBarProps) => {
  return (
    <div className="search-wrapper">
      <FiSearch className="icon left" />

      <input
        type="text"
        placeholder="Search Document.."
        value={value}
        onChange={onChange}
      />

      <FiSliders
        className="icon right"
        onClick={onFilterClick}
      />
    </div>
  );
};

export default SearchBar;
