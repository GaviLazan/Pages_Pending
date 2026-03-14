import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";

export default function SortBar({
  activeSort,
  handleSortChange,
  sortAscending,
  setSortAscending,
  viewMode,
  setViewMode,
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Typography variant="subtitle2">Sort by:</Typography>
        <ButtonGroup>
          <Button
            variant={activeSort === "title" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("title")}
          >
            Title
          </Button>
          <Button
            variant={activeSort === "author" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("author")}
          >
            Author
          </Button>
          <Button
            variant={activeSort === "rating" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("rating")}
          >
            Rating
          </Button>
          <Button
            variant={activeSort === "date" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSortChange("date")}
          >
            Date Added
          </Button>
        </ButtonGroup>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setSortAscending(!sortAscending)}
          sx={{ minWidth: "36px", padding: "4px", alignSelf: "stretch" }}
        >
          {sortAscending ? (
            <ArrowDropUpIcon sx={{ fontSize: "26px" }} />
          ) : (
            <ArrowDropDownIcon sx={{ fontSize: "26px" }} />
          )}
        </Button>
        <Divider orientation="vertical" flexItem />
        <ButtonGroup>
          <Button
            variant={viewMode === "grid" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("grid")}
            sx={{ minWidth: "36px", padding: "4px" }}
          >
            <GridViewIcon fontSize="small" />
          </Button>
          <Button
            variant={viewMode === "list" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("list")}
            sx={{ minWidth: "36px", padding: "4px" }}
          >
            <ViewListIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
