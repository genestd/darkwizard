import React from 'react'

class Settings extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div>
        <div className='menu-icon'>
          <img onClick={this.props.toggleMenu} src='utils/gear.svg'/>
        </div>
        <div className={"navigation " + this.props.menuClass}>
          <ul>
            <li>Toggle Darkness:
              <input name="td" id="td" type="range" min={0} max={1} step={1} value={this.props.td ? 1 : 0} onChange={(e)=>{this.props.handleChange(e.target)}}/>
            </li>
            <li>Monster Density:<br/>
                <input name="md" type="range" min={1} max={5} step={1} value={this.props.md} onChange={(e)=>{this.props.handleChange(e.target)}}/>
            </li>
            <li>Room Count:<br/>
              <input name="rd" type="range" min={1} max={5} step={1} value={this.props.rd} onChange={(e)=>{this.props.handleChange(e.target)}}/>
            </li>
            <li>Tile Size:<br/>
              <input name="ts" type="range" min={15} max={25} step={5} value={this.props.ts} onChange={(e)=>{this.props.handleChange(e.target)}}/>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Settings
