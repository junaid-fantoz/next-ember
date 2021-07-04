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
      selectedMaxYear: null,
      selectedMinYear: null,
      selecteLaunchPad: null,
      // exampleInput: "",
    };
  }

  // some change handlers ready for you
  handleKeywordChange = () => {};

  handleMinYearChange = (selectedOption) => {
    this.setState({
      selectedMinYear: selectedOption,
    });
  };

  handleMaxYearChange = (selectedOption) => {
    this.setState({
      selectedMaxYear: selectedOption,
    });
  };

  handleLaunchPadChange = (selectedOption) => {
    this.setState({ selecteLaunchPad: selectedOption });
  };

  // an example change handler for a <TextInput /> element
  handleInputChange = (value) => {
    this.setState({ keywords: value });
  };

  // handler for calling the filter update
  handleFilterUpdate = () => {
    const { launches, onFilterChange } = this.props;
    let { keywords, selectedMaxYear, selectedMinYear } = this.state;

    keywords = keywords.toLowerCase().trim();

    let arr = [];

    arr = [
      ...arr,
      launches.filter((l) => {
        const { rocketName, payloadId, flightNumber, launchDate } = l;

        if (
          keywords &&
          (rocketName.toLowerCase().includes(keywords) ||
            payloadId.toLowerCase().includes(keywords) ||
            keywords.includes(String(flightNumber)))
        ) {
          return l;
        }
        if (
          selectedMinYear &&
          selectedMaxYear &&
          selectedMinYear.value <= moment(launchDate).year() &&
          selectedMaxYear.value >= moment(launchDate).year()
        ) {
          return l;
        }
      }),
    ];
    onFilterChange(arr[0]);
  };

  componentDidMount() {
    axios.get("/launchpads").then((result) =>
      this.setState({
        launchPadOptions: [{ label: "Any", full_name: "Any" }, ...result.data],
      })
    );
  }

  render() {
    const {
      keywords,
      launchPadOptions,
      selecteLaunchPad,
      selectedMaxYear,
      selectedMinYear,
    } = this.state;
    const { dropDownYears } = this.props;

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
          value={selecteLaunchPad || launchPadOptions[0]}
          onChange={this.handleLaunchPadChange}
          options={launchPadOptions.map(({ id, full_name }) => ({
            label: full_name,
            value: id,
          }))}
          uid="example-select"
        />
        <Select
          label="Min Year"
          value={selectedMinYear || dropDownYears[0]}
          onChange={this.handleMinYearChange}
          options={dropDownYears}
          uid="example-select"
        />
        <Select
          label="Max Year"
          value={selectedMaxYear || dropDownYears[0]}
          onChange={this.handleMaxYearChange}
          options={dropDownYears}
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
  dropDownYears: PropTypes.array,
};

LaunchFilter.defaultProps = {
  onFilterChange: () => {},
};

export default LaunchFilter;
