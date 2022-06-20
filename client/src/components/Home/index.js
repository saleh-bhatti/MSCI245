import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

//Dev mode
const serverURL = ""; //enable for dev mode

//Deployment mode instructions
//const serverURL = "http://ov-research-4.uwaterloo.ca:PORT"; //enable for deployed mode; Change PORT to the port number given to you;
//To find your port number:
//ssh to ov-research-4.uwaterloo.ca and run the following command:
//env | grep "PORT"
//copy the number only and paste it in the serverURL in place of PORT, e.g.: const serverURL = "http://ov-research-4.uwaterloo.ca:3000";

const fetch = require("node-fetch");

const opacityValue = 0.9;

const theme = createTheme({
  palette: {
    type: "light",
    background: {
      default: "#ffffff",
    },
    primary: {
      main: "#0099ff",
    },
    secondary: {
      main: "#cc0000",
    },
  },
});

const styles = (theme) => ({
  root: {
    body: {
      backgroundColor: "#000000",
      opacity: opacityValue,
      overflow: "hidden",
    },
  },
  mainMessage: {
    opacity: opacityValue,
  },

  mainMessageContainer: {
    marginTop: "20vh",
    marginLeft: theme.spacing(20),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(4),
    },
  },
  paper: {
    overflow: "hidden",
  },
  message: {
    opacity: opacityValue,
    maxWidth: 250,
    paddingBottom: theme.spacing(2),
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      mode: 0,
    };
  }

  componentDidMount() {
    //this.loadUserSettings();
  }

  loadUserSettings() {
    this.callApiLoadUserSettings().then((res) => {
      //console.log("loadUserSettings returned: ", res)
      var parsed = JSON.parse(res.express);
      console.log("loadUserSettings parsed: ", parsed[0].mode);
      this.setState({ mode: parsed[0].mode });
    });
  }

  callApiLoadUserSettings = async () => {
    const url = serverURL + "/api/loadUserSettings";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        userID: this.state.userID,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  };

  render() {
    const { classes } = this.props;

    const mainMessage = (
      <Grid
        container
        spacing={0}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        style={{ minHeight: "100vh" }}
        className={classes.mainMessageContainer}
      >
        <Grid item>
          <Typography
            variant={"h3"}
            className={classes.mainMessage}
            align="flex-start"
          >
            {this.state.mode === 0 ? (
              <React.Fragment>Welcome to MSCI 245</React.Fragment>
            ) : (
              <React.Fragment>Welcome back!</React.Fragment>
            )}
          </Typography>
        </Grid>
      </Grid>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
        </div>

        <Review />
      </MuiThemeProvider>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);

const Review = () => {
  const [selectedMovie, setMovie] = React.useState("");
  const [enteredTitle, setTitle] = React.useState("");
  const [enteredReview, setReview] = React.useState("");
  const [selectedRating, setRating] = React.useState("");
  const [errorMovie, setErrorMovie] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState(false);
  const [errorReview, setErrorReview] = React.useState(false);
  const [errorRating, setErrorRating] = React.useState(false);

  const handleSubmitValidation = (event) => {
    if (selectedMovie === "") {
      setErrorMovie(true);
    }
    if (enteredTitle === "") {
      setErrorTitle(true);
    }
    if (enteredReview === "") {
      setErrorReview(true);
    }
    if (selectedRating === "") {
      setErrorRating(true);
    }
    if (selectedMovie.length > 0){
      setErrorMovie(false);
    }
    if (enteredTitle.length > 0){
      setErrorTitle(false);
    }
    if (enteredReview.length > 0){
      setErrorReview(false);
    }
    if (selectedRating.length > 0){
      setErrorRating(false);
    }
  };

  return (
    <Grid container maxWidth="lg" justify="center">
      <div>
        <h1>
          <Typography variant="h3">Movie Reviews </Typography>
        </h1>
        <MovieSelection
          onChange={setMovie}
          value={selectedMovie}
          error={errorMovie}
        >
        </MovieSelection>
        <ReviewTitle
          onChange={setTitle}
          value={enteredTitle}
          error={errorTitle}
        >
        </ReviewTitle>
        <ReviewBody 
          onChange={setReview} 
          value={enteredReview}
          error={errorReview}
        >
        </ReviewBody>
        <div>
        <ReviewRating
          onChange={setRating}
          value={selectedRating}
          error={errorRating}
        >
        </ReviewRating>
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ position: "relative", top: "20px" }}
          onClick={handleSubmitValidation}
        >
          Submit
        </Button>
        <p>
          <br></br>
          Movie Reviewed: {selectedMovie}
          <br></br>
          Review Title: {enteredTitle}
          <br></br>
          Review: {enteredReview}
          <br></br>
          Rating: {selectedRating}/5
        </p>
      </div>
    </Grid>
  );
};

const MovieSelection = (props) => {
  const handleMovieChange = (event) => {
    props.onChange(event.target.value);
  };
  return (
    <FormControl
    fullWidth
    error={props.error}
    >
      <InputLabel>Movie</InputLabel>
      <Select 
      value={props.value}
      onChange={handleMovieChange} 
      >
        <MenuItem value="Alvin and the Chipmunks">
          Alvin and the Chipmunks
        </MenuItem>
        <MenuItem value="Alvin and the Chipmunks: The Squeakquel">
          Alvin and the Chipmunks: The Squeakquel
        </MenuItem>
        <MenuItem value="Alvin and the Chipmunks: Chipwrecked">
          Alvin and the Chipmunks: Chipwrecked
        </MenuItem>
        <MenuItem value="Alvin and the Chipmunks: The Road Chip">
          Alvin and the Chipmunks: The Road Chip
        </MenuItem>
        <MenuItem value="Interstellar">Interstellar</MenuItem>
      </Select>
      <FormHelperText>Select a movie to review</FormHelperText>
    </FormControl>
  );
};

const ReviewTitle = (props) => {
  const handleTitleChange = (event) => {
    props.onChange(event.target.value);
  };
  return (
    <TextField
      id="outlined-basic"
      fullWidth={true}
      label="Review Title"
      helperText="Enter your review title"
      onChange={handleTitleChange}
      value={props.value}
      error={props.error}
    />
  );
};

const ReviewBody = (props) => {
  const handleReviewChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <TextField
      id="outlined-multiline-static"
      label="Review"
      multiline
      minRows={8}
      fullWidth={true}
      helperText="Enter your review (max 200 characters)"
      error={props.error}
      inputProps={{
        maxLength: 200,
      }}
      onChange={handleReviewChange}
    />
  );
};

const ReviewRating = (props) => {
  const handleRatingChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <FormControl 
    style={{ position: "relative", top: "10px" }}
    error={props.error}
    helperText="Please select a rating"
    >
      <FormLabel component="legend">Select Rating</FormLabel>
      <RadioGroup
        name="rating"
        onChange={handleRatingChange}
        value={props.value}
      >
        <FormControlLabel value="1" control={<Radio />} label="1" />
        <FormControlLabel value="2" control={<Radio />} label="2" />
        <FormControlLabel value="3" control={<Radio />} label="3" />
        <FormControlLabel value="4" control={<Radio />} label="4" />
        <FormControlLabel value="5" control={<Radio />} label="5" />
      </RadioGroup>
    </FormControl>
  );
};
