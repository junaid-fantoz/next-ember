import React from "react";
import PropTypes from "prop-types";

import Select from "../Select";
import TextInput from "../TextInput";
import Button, { TYPES as BUTTON_TYPES } from "../Button";
import styles from "./launch-filter.module.scss";
import axios from "axios";
import moment from "moment";

/**
 * Launch filter holds the filter state and writes the changes to the filters
 * back up to the parent element on click of the apply button
 */
class LaunchFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: "",
      launchPad: null,
      minYear: null,
      maxYear: null,
      launchPadOptions: [],

      // example state you will need to remove
      selectedOption: null,
      // exampleInput: "",
    };
  }

  // some change handlers ready for you
  handleKeywordChange = () => {};
  handleLaunchPadChange = () => {};
  handleMinYearChange = () => {};
  handleMaxYearChange = () => {};

  // and example change handler for a <Select /> element
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  // an example change handler for a <TextInput /> element
  handleInputChange = (value) => {
    this.setState({ keywords: value });
  };

  // handler for calling the filter update
  handleFilterUpdate = () => {
    const { launches, onFilterChange } = this.props;
    const { keywords } = this.state;
    
    if(keywords === ''){
      this.props.renderAllLaunches();
    }
    else{
      const filteredLauches = launches.filter((l) => {
        const { rocketName, payloadId } = l;
        if (rocketName.includes(keywords) || payloadId.includes(keywords)) {
          return l;
        }
      });
      onFilterChange(filteredLauches);
    }
    
   
  };

  componentDidMount() {
    axios.get("/launchpads").then((result) =>
      this.setState({
        launchPadOptions: [{ label: "Any", full_name: "Any" }, ...result.data],
      })
    );
  }

  render() {
    const { keywords, selectedOption, launchPadOptions } = this.state;
    const { launches } = this.props;

    return (
      <section className={styles.launchFilter}>
        <TextInput
          placeholder="eg Falcon"
          label="Keywords"
          value={keywords}
          onChange={this.handleInputChange}
          uid="example-text-input"
        />
        <Select
          label="Launch Pad"
          value={selectedOption || launchPadOptions[0]}
          onChange={this.handleChange}
          options={launchPadOptions.map(({ id, full_name }) => ({
            label: full_name,
            value: id,
          }))}
          uid="example-select"
        />
        <Select
          label="Min Year"
          value={selectedOption}
          onChange={this.handleChange}
          options={launches.map(({ launchDate }) => {
            const year = moment(launchDate).year();
            return {
              label: year,
              value: year,
            };
          })}
          uid="example-select"
        />
        <Select
          label="Max Year"
          value={selectedOption}
          onChange={this.handleChange}
          options={launches.map(({ launchDate }) => {
            const year = moment(launchDate).year();
            return {
              label: year,
              value: year,
            };
          })}
          uid="example-select"
        />
        <Button onClick={this.handleFilterUpdate} type={BUTTON_TYPES.PRIMARY}>
          Apply
        </Button>
      </section>
    );
  }
}

LaunchFilter.propTypes = {
  // used to let parent component know about changes
  // to the filters
  onFilterChange: PropTypes.func,
  launches: PropTypes.array,
};

LaunchFilter.defaultProps = {
  onFilterChange: () => {},
};

export default LaunchFilter;
