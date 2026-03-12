import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function SortBar({
  activeSort,
  handleSortChange,
  sortAscending,
  setSortAscending,
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
        {/* <Typography variant="subtitle2">Sort descending?</Typography> */}
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
      </div>
    </>
  );
}
