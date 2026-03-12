import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function FilterBar({
  activeFilter,
  handleFilterChange,
  lentFilter,
  setLentFilter,
}) {
  return (
    <>
      <div style={{ display: "flex", overflowX: "auto", gap: "8px" }}>
        <Tooltip title="All Books">
          <Button
            variant={activeFilter === "all" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleFilterChange("all")}
          >
            All
          </Button>
        </Tooltip>
        <Tooltip title="Untagged Books">
          <Button
            variant={activeFilter === "untagged" ? "contained" : "outlined"}
            color="secondary"
            sx={activeFilter === "tbr" ? {} : { color: "#505050" }}
            onClick={() => handleFilterChange("untagged")}
          >
            Untagged
          </Button>
        </Tooltip>
        <Tooltip title="To Be Read">
          <Button
            variant={activeFilter === "tbr" ? "contained" : "outlined"}
            sx={
              activeFilter === "tbr"
                ? { backgroundColor: "#fff9e6", color: "#8b6914" }
                : { color: "#8b6914" }
            }
            onClick={() => handleFilterChange("tbr")}
          >
            TBR
          </Button>
        </Tooltip>
        <Tooltip title="Currently Reading">
          <Button
            variant={activeFilter === "reading" ? "contained" : "outlined"}
            sx={
              activeFilter === "reading"
                ? { backgroundColor: "#e6f2ff", color: "#1e5a99" }
                : { color: "#1e5a99" }
            }
            onClick={() => handleFilterChange("reading")}
          >
            Reading
          </Button>
        </Tooltip>
        <Tooltip title="Read Books">
          <Button
            variant={activeFilter === "read" ? "contained" : "outlined"}
            sx={
              activeFilter === "read"
                ? { backgroundColor: "#e8f5e9", color: "#2e7d32" }
                : { color: "#2e7d32" }
            }
            onClick={() => handleFilterChange("read")}
          >
            Read
          </Button>
        </Tooltip>
        <Tooltip title="Did Not Finish">
          <Button
            variant={activeFilter === "dnf" ? "contained" : "outlined"}
            sx={
              activeFilter === "dnf"
                ? { backgroundColor: "#ffebee", color: "#c62828" }
                : { color: "#c62828" }
            }
            onClick={() => handleFilterChange("dnf")}
          >
            DNF
          </Button>
        </Tooltip>
      </div>
      <Divider orientation="vertical" flexItem />
      <div className="lent-toggle">
        <ButtonGroup>
          <Button
            variant={lentFilter === null ? "contained" : "outlined"}
            color="primary"
            onClick={() => setLentFilter(null)}
          >
            All
          </Button>
          <Button
            variant={lentFilter === "hide" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setLentFilter("hide")}
          >
            Hide Lent
          </Button>
          <Button
            variant={lentFilter === "show" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setLentFilter("show")}
          >
            Lent Only
          </Button>
        </ButtonGroup>
      </div>
      <Divider orientation="vertical" flexItem />
    </>
  );
}
