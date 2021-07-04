import React from "react";
import axios from "axios";
import LaunchFilter from "../LaunchFilter";
import LaunchItem from "../LaunchItem";

import styles from "./launches.module.scss";
import moment from "moment";

/**
 * Launches component responsible for showing the filter component,
 * handling the fetching and filtering of the launch data and rendering
 * the launches that match the selected filters
 */
class Launches extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: null,
      launches: [],
      filter: {
        minYear: null,
        maxYear: null,
        keywords: null,
        launchPad: null,
      },
      dropDownYears: [],
    };
  }

  handleFilterChange = (filterObj) => {
    this.setState({ filter: filterObj });
  };

  /**
   * Responsible for transforming the data from the launch and launchpad api's
   * into a usable and consistent format for the LaunchItem component
   */
  _launchDataTransform = (launchResp, launchPads) => {
    const {
      flight_number: flightNumber,
      launch_success: missionFailed,
      launch_site: { site_name: launchSiteName },
      links: {
        mission_patch: missionPatchLink,
        article_link: articleLink,
        video_link: videoLink,
        reddit_campaign: redditCampaignLink,
        reddit_launch: redditLaunchLink,
        reddit_media: redditMediaLink,
        presskit: pressKitLink,
      },
      rocket: { rocket_name: rocketName },
      payloads: [{ payload_id: payloadId }],
      launch_date_local: launchDate,
    } = launchResp;

    const resultObj = {
      rocketName,
      payloadId,
      launchDate,
      launchSiteName,
      flightNumber,
      missionFailed,
      missionPatchLink,
      redditCampaignLink,
      redditLaunchLink,
      redditMediaLink,
      pressKitLink,
      articleLink,
      videoLink,
    };

    return resultObj;
  };

  _renderLaunches = () => {
    const {
      launches,
      filter: { keywords, selectedMinYear, selectedMaxYear },
    } = this.state;

    console.log('selected Year', selectedMinYear, selectedMaxYear);

    // const launchFilter = () => {
    //   // do something with the filter obj
    //   return true;
    // };

    // const filteredLaunches = launches
    //   .map((l) => this._launchDataTransform(l, launchPadData))
    //   .filter(launchFilter);

    let filteredLaunches = [];
    if (keywords || selectedMaxYear || selectedMinYear) {
      filteredLaunches = launches.filter((l) => {
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
      });
    }
    else {
      filteredLaunches = launches;
    }


    return filteredLaunches.map((l, index) => (
      <LaunchItem {...l} key={index} />
    ));
  };

  setDropDownYearsValues = (transformedLaunches) => {
    const dropDownYears = transformedLaunches.map(({ launchDate }) => {
      const year = moment(launchDate).year();
      return {
        label: year,
        value: year,
      };
    });

    const uniqueYearsArray = dropDownYears.filter((thing, index) => {
      const _thing = JSON.stringify(thing);
      return (
        index ===
        dropDownYears.findIndex((obj) => {
          return JSON.stringify(obj) === _thing;
        })
      );
    });

    this.setState({
      dropDownYears: [{ value: "Any", label: "Any" }, ...uniqueYearsArray],
    });
  };

  getAllLaunches = async () => {
    const result = await axios.get("/launches");
    return result.data;
  };

  componentDidMount() {
    this.getAllLaunches().then((launches) => {
      const transformedLaunches = launches.map((l) =>
        this._launchDataTransform(l, [])
      );

      this.setState({ launches: transformedLaunches });

      this.setDropDownYearsValues(transformedLaunches);
    });
  }

  render() {
    const { launches, dropDownYears } = this.state;
    console.log('Launches', launches);
    return (
      <section className={`${styles.launches} layout-l`}>
        <LaunchFilter
          onFilterChange={this.handleFilterChange}
          dropDownYears={dropDownYears}
        />
        <div className={styles.summary}>
          <p>Showing {launches.length} Missions</p>
        </div>
        {this._renderLaunches()}
      </section>
    );
  }
}

export default Launches;
