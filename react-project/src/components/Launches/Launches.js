import React from "react";
import axios from "axios";
import LaunchFilter from "../LaunchFilter";
import LaunchItem from "../LaunchItem";

import styles from "./launches.module.scss";

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
    };
  }

  handleFilterChange = (filteredLaunches) => {
    this.setState({ launches: filteredLaunches });
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
    const { launches } = this.state;

    const launchFilter = () => {
      // do something with the filter obj
      return true;
    };

    const filteredLaunches = launches
      // .map((l) => this._launchDataTransform(l, launchPadData))
      .filter(launchFilter);


    return filteredLaunches.map((l, index) => (
      <LaunchItem {...l} key={index} />
    ));
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
    });
  }

  render() {
    const { launches } = this.state;
    return (
      <section className={`${styles.launches} layout-l`}>
        <LaunchFilter
          launches={launches}
          onFilterChange={this.handleFilterChange}
          renderAllLaunches={this.renderAllLaunches}
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
