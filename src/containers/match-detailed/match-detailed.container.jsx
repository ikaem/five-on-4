import React from "react";
import { Link, withRouter } from "react-router-dom";

import "./match-detailed.styles.css";

import JoinUnjoinMatch from "../../components/join-unjoin-match/join-unjoin-match.component";
import MatchDetailedContent from "../../components/match-detailed-content/match-detailed-content.component";
import WeatherView from "../../components/weather-view/weather-view.component";

class MatchDetailed extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            match_id: "",
            match_name: "",
            match_date_start: "",
            match_date_end: "",
            match_venue: "",
            match_players_signed_up: [],
            match_players_attended: [],
            match_home_score: "0",
            match_away_score: "0",
            match_scorers: [],
            match_home_team: [],
            match_away_team: [],
            match_reported: null,
        };
    }
    componentDidMount(){
        const {id} = this.props.match.params;
        const {fetchEndPoint, setStateGlobalMessage} = this.props;

        fetchEndPoint("get", `/detailedmatch/${id}`)
        .then(detailedMatchResponse => 
            detailedMatchResponse.message === "detailed match retrieved successfully" && this.setState(detailedMatchResponse.data))
        .catch(detldMtchErr => {
            console.log(detldMtchErr);
            setStateGlobalMessage("there was a problem with retrieving match data");
        })
    }
    // function for setting match state for other components
    setStateMatchDetailed = (match) => {
        this.setState(match);
    }

    render(){
        const {goBack} = this.props.history;

        const {
            user_id,
            user_signed_up_matches,
            fetchEndPoint,
            setStateMatches,
            setStatePlayerMatches,
            setStateGlobalMessage
        } = this.props;
        const {match_id, match_date_start} = this.state;
        return (
            <div className="match-detailed">
                <p className="button-go-back" onClick={goBack}>Go Back</p>
                <div className="match-detailed-grid">
                    {match_date_start && 
                    <MatchDetailedContent
                        detailed_match={this.state}
                        user_id={user_id}>
                        {user_id? (  
                        <JoinUnjoinMatch
                            user_id={user_id}
                            match_id={match_id} 
                            user_signed_up_matches={user_signed_up_matches}
                            fetchEndPoint={fetchEndPoint}
                            setStateMatches={setStateMatches} 
                            setStatePlayerMatches={setStatePlayerMatches}
                            setStateGlobalMessage={setStateGlobalMessage}
                            setStateMatchDetailed={this.setStateMatchDetailed}
                            detailed_match
                        />): <Link to="/login">Login to Join</Link>}
                    </MatchDetailedContent>}

                    {match_date_start && 
                    <WeatherView
                        adjustMargin={"detailed-adjust-margin"}
                        matchDate={Math.round(new Date(match_date_start).getTime()/1000)}
                        fetchEndPoint={fetchEndPoint}/>}
                </div>
            </div>
        )
    }    
}

export default withRouter(MatchDetailed);