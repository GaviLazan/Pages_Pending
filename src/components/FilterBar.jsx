import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";

export default function FilterBar({
  activeFilter,
  handleFilterChange,
  lentFilter,
  setLentFilter,
}) {
  return (
    <>
      <Button
        variant={activeFilter === "all" ? "contained" : "outlined"}
        color="primary"
        onClick={() => handleFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={activeFilter === "untagged" ? "contained" : "outlined"}
        color="secondary"
        onClick={() => handleFilterChange("untagged")}
      >
        Untagged
      </Button>
      <Button
        variant={activeFilter === "tbr" ? "contained" : "outlined"}
        sx={
          activeFilter === "tbr"
            ? { backgroundColor: "#fff3cd", color: "#6b5104" }
            : { color: "#6b5104", borderColor: "#6b5104" }
        }
        onClick={() => handleFilterChange("tbr")}
      >
        TBR
      </Button>
      <Button
        variant={activeFilter === "reading" ? "contained" : "outlined"}
        sx={
          activeFilter === "reading"
            ? { backgroundColor: "#cfe2ff", color: "#084298" }
            : { color: "#084298", borderColor: "#084298" }
        }
        onClick={() => handleFilterChange("reading")}
      >
        Currently Reading
      </Button>
      <Button
        variant={activeFilter === "read" ? "contained" : "outlined"}
        sx={
          activeFilter === "read"
            ? { backgroundColor: "#d1e7dd", color: "#0f5132" }
            : { color: "#0f5132", borderColor: "#0f5132" }
        }
        onClick={() => handleFilterChange("read")}
      >
        Read
      </Button>
      <Button
        variant={activeFilter === "dnf" ? "contained" : "outlined"}
        sx={
          activeFilter === "dnf"
            ? { backgroundColor: "#f8d7da", color: "#842029" }
            : { color: "#842029", borderColor: "#842029" }
        }
        onClick={() => handleFilterChange("dnf")}
      >
        DNF
      </Button>
      <label> Hide Lent Books</label>
      <Switch
        onChange={() => setLentFilter(lentFilter ? false : true)}
        checked={lentFilter}
      />
    </>
  );
}
