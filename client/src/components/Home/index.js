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
import { Menu } from "@material-ui/core";

//Dev mode
// const serverURL = ""; //enable for dev mode

//my port is 3070

//Deployment mode instructions
const serverURL = "http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3070"; //enable for deployed mode; Change PORT to the port number given to you;
//To find your port number:
//ssh to ec2-18-216-101-119.us-east-2.compute.amazonaws.com and run the following command:
//env | grep "PORT"
//copy the number only and paste it in the serverURL in place of PORT, e.g.: const serverURL = "ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3000";

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

  React.useEffect(() => {
    getMovies();
  },[]);

  const [moviesList, setMoviesList] = React.useState([]);

  const [user, setUser] = React.useState(1);
  const [selectedMovieID, setMovieID] = React.useState();

  const [selectedMovie, setMovie] = React.useState("");
  const [enteredTitle, setTitle] = React.useState("");
  const [enteredReviewBody, setReviewBody] = React.useState("");
  const [selectedRating, setRating] = React.useState("");

  const [errorMovie, setErrorMovie] = React.useState(false);
  const [errorTitle, setErrorTitle] = React.useState(false);
  const [errorReviewBody, setErrorReviewBody] = React.useState(false);
  const [errorRating, setErrorRating] = React.useState(false);

  const handleSubmitValidation = (event) => {
    if (selectedMovie === "") {
      setErrorMovie(true);
    }
    if (enteredTitle === "") {
      setErrorTitle(true);
    }
    if (enteredReviewBody === "") {
      setErrorReviewBody(true);
    }
    if (selectedRating === "") {
      setErrorRating(true);
    }
    if (selectedMovie.length > 0) {
      setErrorMovie(false);
    }
    if (enteredTitle.length > 0) {
      setErrorTitle(false);
    }
    if (enteredReviewBody.length > 0) {
      setErrorReviewBody(false);
    }
    if (selectedRating.length > 0) {
      setErrorRating(false);
    }
    if (
      selectedMovie.length > 0 &&
      enteredTitle.length > 0 &&
      enteredReviewBody.length > 0 &&
      selectedRating.length > 0
    ) {
      // window.alert("Your Review has been Submitted!");
        addReview();
    }
  };

  const getMovies = () => {
    callApiGetMovies().then((res) => {
      console.log("callApiGetMovies returned: ", res);
      var parsed = JSON.parse(res.express);
      console.log("callApiGetMovies parsed: ", parsed[0]);
      setMoviesList(parsed);
    });
  };

  const callApiGetMovies = async () => {
    const url = serverURL + "/api/getMovies";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const addReview = () => {
    callApiAddReview().then((res) => {

    });
  };

  const callApiAddReview = async () => {
    const url = serverURL + "/api/addReview";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieID: selectedMovieID, 
        userID: user,
        reviewTitle: enteredTitle,
        reviewContent: enteredReviewBody,
        reviewScore: selectedRating,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <Grid container maxWidth="lg" justify="center">
      <div>
        <h1>
          <Typography variant="h3">Movie Reviews </Typography>
        </h1>
        <MovieSelection
          onChangeMovie={setMovie}
          onChangeMovieID={setMovieID}
          value={selectedMovie}
          error={errorMovie}
          moviesList={moviesList}
        ></MovieSelection>
        <ReviewTitle
          onChange={setTitle}
          value={enteredTitle}
          error={errorTitle}
        ></ReviewTitle>
        <ReviewBody
          onChange={setReviewBody}
          value={enteredReviewBody}
          error={errorReviewBody}
        ></ReviewBody>
        <div>
          <ReviewRating
            onChange={setRating}
            value={selectedRating}
            error={errorRating}
          ></ReviewRating>
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
          Review: {enteredReviewBody}
          <br></br>
          Rating: {selectedRating}/5
        </p>
      </div>
    </Grid>
  );
};

const MovieSelection = (props) => {

  const handleMovieChange = (event) => {
    props.onChangeMovie(event.target.value);
    props.onChangeMovieID((event.currentTarget.dataset.id));
  };

  return (
    <FormControl fullWidth error={props.error}>
      <InputLabel>Movie</InputLabel>
      <Select value={props.value} onChange={handleMovieChange}>
        {props.moviesList.map((item) => {
          return <MenuItem data-id = {item.id} value={item.name}>{item.name}</MenuItem>;
        })}
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
