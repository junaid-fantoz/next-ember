import React from "react";
import PropTypes from "prop-types";

import Select from "../Select";
import TextInput from "../TextInput";
import Button, { TYPES as BUTTON_TYPES } from "../Button";
import styles from "./launch-filter.module.scss";

// Example static option value
// the real options will need to come from the api
const options = [{ value: null, label: "Any" }];

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

      // example state you will need to remove
      selectedOption: options[0],
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

  render() {
    const { keywords, selectedOption } = this.state;

    return (
      <section className={styles.launchFilter}>
        <TextInput
          placeholder="eg Falcon"
          label="Keywords"
          value={keywords}
          onChange={this.handleInputChange}
          uid="example-text-input"
        />
        {/* <Select
          label="Launch Pad"
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          uid="example-select"
        />
        <Select
          label="Min Year"
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          uid="example-select"
        />
        <Select
          label="Max Year"
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          uid="example-select"
        /> */}
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
