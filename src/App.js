import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

import { Typography, Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const item1 = {
  id: v4(),
  name: "wash the house",
};

const item2 = {
  id: v4(),
  name: "clean the car",
};

const item3 = {
  id: v4(),
  name: "Read the story books",
};

function App() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "Todo",
      items: [item1, item2, item3],
    },
    "in-progress": {
      title: "In Progress",
      items: [],
    },
    done: {
      title: "Completed",
      items: [],
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const addItem = () => {
    if (text.length > 0) {
      setError("");
      setState((prev) => {
        return {
          ...prev,
          todo: {
            title: "Todo",
            items: [
              {
                id: v4(),
                name: text,
              },
              ...prev.todo.items,
            ],
          },
        };
      });
      setOpen(false);
    } else {
      setError("* Enter a valid one");
    }
    setText("");
  };

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={10} lg={10}>
          <Typography variant="h5" style={{ marginLeft: "510px" }}>
            Todo List Application
          </Typography>
        </Grid>
        <Grid item xs={2} lg={2}>
          <Button
            variant="outlined"
            style={{ backgroundColor: "#12de6a" }}
            onClick={handleClickOpen}
          >
            Add new task +
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add a new task</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter you new task</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={addItem} color="primary" disabled={!text}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Grid container direction="row-reverse">
        <Grid item>
          {error && (
            <span style={{ color: "red", marginRight: "190px" }}>{error}</span>
          )}
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={3} style={{ marginTop: "20px" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className={"column"}>
                <h3 className="title">{data.title}</h3>
                <Droppable droppableId={key}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"droppable-col"}
                      >
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                console.log(snapshot);
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </Grid>
    </div>
  );
}

export default App;
