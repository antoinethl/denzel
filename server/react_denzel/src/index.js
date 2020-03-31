import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const axios = require('axios');

class MWmovie extends React.Component {

	state = {
		movie: []
	}

	componentDidMount() {
		axios.get("http://localhost:9292/movies")
		.then(res => {
			const movie = res.data;
			this.setState({ movie });
		})
	}

	render() {
		const d = this.state.movie
		const listItems = (
			<div>
				<h1><img className="fit-picture" src="1.png" alt="oops"/>DENZEL MOVIE APPLICATION</h1>
				<br/>
				<div className="movie">
					<h2>A MUTCH WATCH movie about Denzel !</h2>
					<hr/>
					<div className="title"><b>Title:</b> {d.title}</div><br/>
					<div className="metascore"><b>Metascore:</b> {d.metascore}</div>
					<div className="link"><b>Link:</b> {d.link}</div>
					<div className="year"><b>Year:</b> {d.year}</div>
					<div className="rating"><b>Rating:</b> {d.rating}</div>
					<div className="metascore"><b>Votes:</b> {d.votes}</div>
					<div className="rating"><b>Synopsis:</b> {d.synopsis}</div>
					<hr/>
				</div> 
				<div id="menu">
				</div>
				<div id="movies">
				</div>
			</div>
			);
		
		return (
			<div>
			{listItems}
			</div>
			);
	}
}

class Movies extends React.Component {

	state = {
		movie: []
	}

	// I TRIED TO DO AN INPUT FIELD TO CHOOSE THE METASCORE + LIMITE SO WE CAN REQUEST USING THESE FIELDS BUT IT DOESNT WORK WELL =(
	componentDidMount() {
		//var metascore = document.getElementById('metascore').value;
		//var limit = document.getElementById('limit').value;
		axios.get(`http://localhost:9292/movies/search?limit=5&metascore=77`)
		.then(res => {
			const movie = res.data.results;
			this.setState({ movie });
		})
	}

	render() {
		const data = this.state.movie
		const listItems = data.map((d) =>
			<div className="movie">
				<hr/>
				<div className="title"><b>Title:</b> {d.title}</div><br/>
				<div className="metascore"><b>Metascore:</b> {d.metascore}</div>
				<div className="link"><b>Link:</b> {d.link}</div>
				<div className="year"><b>Year:</b> {d.year}</div>
				<div className="rating"><b>Rating:</b> {d.rating}</div>
				<div className="metascore"><b>Votes:</b> {d.votes}</div>
				<div className="rating"><b>Synopsis:</b> {d.synopsis}</div>
				<hr/>
			</div> 
			);

		return (
			<div>
			{listItems}
			</div>
			);
	}
}

class Menu extends React.Component {

	render() {
		const listItems = (
			<div>
				<table className="tab1">
					<tbody>
      					<tr>
        					<th>Choose a metascore!</th>
        					<th>Choose a movie limit!</th>
      					</tr>
      					<tr>
        					<td><input id="metascore" className="input1" type="number" placeholder="Enter a metascore"/></td>
        					<td><input id="limit" className="input1" type="number" placeholder="Enter a limit"/></td>
      					</tr>
      				</tbody>
    			</table>
    			<button className="square" onClick = 
    				{() => ReactDOM.render(
						<Movies />,
						document.getElementById('movies')
					)} >Search!</button>
			</div> 
			);
		
		return (
			<div>
			{listItems}
			</div>
			);
	}
} 

ReactDOM.render(
	<MWmovie />,
	document.getElementById('root')
	);

ReactDOM.render(
	<Menu />,
	document.getElementById('menu')
	);