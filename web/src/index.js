import './config';
import React from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import $ from 'jquery';
import { Layout, Menu, Typography, Icon, Button } from 'antd';
import Home from './home.js';
import Login from './user/login.js';
import Information from './user/information.js';
import TeamList from './team/list.js';
import TeamDetail from './team/detail.js';
import TeamManage from './team/manage.js';
import Notice from './notice.js';
import Leaderboard from './team/leaderboard.js';
import Leaderboard_test from './team/leaderboard_test.js';
import AIList from './ai/list.js'
import AIUpload from './ai/upload.js'
import AIList_team from './ai/list_team.js'
import ASTA_logo from './assets/ASTA_logo.jpg'
import AIUpload_test from './ai/upload_test.js'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const Tips = "目前为fc17的内测阶段，只提供选手包供选手们下载进行测试，开启正式报名后提供组队报名及其他相关功能"


class App extends React.Component {
	state = {
		collapsed: false,
		user: null,
		userLoading: false,
	}
	
	onCollapse = collapsed => {
		console.log(collapsed);
		this.setState({ collapsed });
	}
	
	componentDidMount(){
		this.updateUser();
	}
	
	download = (url) => {
		let a = document.createElement('a');
		a.href = url;
		a.click();
    };
	updateUser = () => {
		if (this.state.userLoading) return
		let url = global.constants.server + 'api/user/';
		this.loginRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			async: true,
			success: function (result) {
				if (result.id && result !== this.state.user){
					this.setState({user: result});
				}
			}.bind(this),
			beforeSend: function(){
				this.setState({userLoading: true})
			}.bind(this),
			complete: function(){
				this.setState({userLoading: false})
			}.bind(this),
		});
	}
	
	logout = (e) => {
		let url = global.constants.server + 'api/user/logout/';
		this.logoutRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				this.setState({user : null});
			}.bind(this)
		});
	}
	
	getUserMenu = () =>{
		if (this.state.user != null){
			return (
			<SubMenu
				key="user"
				title={
					<span>
						<Icon type="user" />
						<span>{this.state.user.username}</span>
					</span>
				}
			>
				<Menu.Item key="information" >
					<Link to="/information">
						<span>Information</span>
					</Link>
				</Menu.Item>
				<Menu.Item key="ai" >
					<Link to="/ai/list">
						<span>AI files</span>
					</Link>
				</Menu.Item>
				<Menu.Item key="logout" onClick={this.logout}>Log out</Menu.Item>
			</SubMenu>
			)
		}else{
			return (
			<Menu.Item key="login">
				<Link to="/login">
					<Icon type="user" />
					<span>Login</span>
				</Link>
			</Menu.Item>
			)
		}
	}
	
	getTeamMenu = () => {
		if (this.state.user != null){
			return (
				<SubMenu
					key="team"
					title={
						<span>
							<Icon type="team" />
							<span>Team</span>
						</span>
					}
				>
					<Menu.Item key="teamList" >
						<Link to="/team/list">
							<span>Team List</span>
						</Link>
					</Menu.Item>
					
					{this.state.user.isMember && this.state.user.team != null ? (
						<Menu.Item key="myTeam">
							<Link to={"/team/detail/" + this.state.user.team.id}>
								<span>{this.state.user.team.name}</span>
							</Link>
						</Menu.Item>
					) : (
						<Menu.Item key="createTeam" >
							<Link to="/team/manage">
								<span>Create Team</span>
							</Link>
						</Menu.Item>
					)}
					{this.state.user.isMember && this.state.user.team != null ? (
						<Menu.Item key="Ai list">
							<Link to="/ai/list_team/">
								<span>AI list</span>
							</Link>
						</Menu.Item>
					):(<div></div>)}
				</SubMenu>
			)
		}else{
			return (
				<Menu.Item key="teamList">
					<Link to="/team/list">
						<Icon type="user" />
						<span>Team List</span>
					</Link>
				</Menu.Item>
			)
		}
	}

	render() {
		let user = this.getUserMenu()
		let team = this.getTeamMenu()
		
		return (
			<Router>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} theme="light">
						<div className="logo">
						<img className="logo_img" src={ASTA_logo} alt="logo" />
							<Title style={{ margin: "auto", marginLeft: 10 }} level={3}>
							ASTA
							</Title>
						</div>
						<Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
							<Menu.Item key="home">
								<Link to="/">
									<Icon type="pie-chart" />
									<span>Home</span>
								</Link>
							</Menu.Item>
							{user}
							{team}
							<Menu.Item key="notice">
								<Link to="/notice">
									<Icon type="info-circle" />
									<span>Notice</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="/leaderboard">
								<Link to="/leaderboard">
									<Icon type="trophy" />
									<span>Leaderboard</span>
								</Link>
							</Menu.Item>
							<SubMenu
								key="test_game"
								title={
									<span>
										<Icon type="android" />
										<span>测试赛</span>
									</span>
								}
							>
								<Menu.Item key="upload_test" >
									<Link to="/ai/upload_test">
										<span>Upload</span>
									</Link>
								</Menu.Item>
								<Menu.Item key="ai" >
									<Link to="/team/leaderboard_test">
										<span>Leaderboard</span>
									</Link>
								</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Layout>
						<Header style={{ background: 'white', padding: 0, display: 'flex', flexDirection: 'row'}} >
							<div style={{ flex: 1 }}>
								<div style={{ flex: 2, fontSize: 25, fontWeight: 'bolder'}}>2020年自动化系新生C语言大赛</div>
								<div>{Tips}</div>
							</div>
							<div>
								<Button type="primary" onClick={(e) => this.download(global.constants.server + 'media/FC17_UserPackage1.5.rar')}>选手包下载</Button>
							</div>
						</Header>
						<Content style={{ margin: '10px 16px' }}>
							<Route path="/" exact component={Home}/>
							<Route path="/information" render={props => 
								<Information
									user={this.state.user}
									{...props} 
								/>}
							/>
							<Route path="/login" exact render={props =>
								<Login
									unLogin={this.state.user == null}
									updateUser={this.updateUser.bind(this)}
									{...props}
								/>}
							/>
							<Route path="/login/:token" exact render={props =>
								<Login
									unLogin={this.state.user == null}
									updateUser={this.updateUser.bind(this)}
									{...props}
								/>}
							/>
							<Route path="/team/list" exact render={props =>
								<TeamList
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path="/team/detail/:teamID" exact render={props =>
								<TeamDetail
									user={this.state.user}
									updateUser={this.updateUser.bind(this)}
									{...props}
								/>}
							/>
							<Route path="/team/manage" exact render={props =>
								<TeamManage
									user={this.state.user}
									updateUser={this.updateUser.bind(this)}
									{...props}
								/>}
							/>
							<Route path="/notice" exact render={props =>
								<Notice
									user={this.state.user}
								/>}
							/>
							<Route path="/leaderboard" exact component={Leaderboard}/>
							<Route path="/ai/list" exact render={props =>
								<AIList
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path ="/ai/upload" exact render={props =>
								<AIUpload
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path ="/ai/list_team" exact render={props =>
								<AIList_team
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path ="/ai/upload_test" exact render={props =>
								<AIUpload_test
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path ="/team/leaderboard_test" exact component={Leaderboard_test}/>
						</Content>
						<Footer style={{ textAlign: 'center' }}>&copy; FC17, DAASTA, 2020</Footer>
					</Layout>
				</Layout>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('container'));