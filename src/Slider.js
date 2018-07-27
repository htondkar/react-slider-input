import React from 'react'
import './slider.css'
import { debouce, setCursorGlobal } from './util'

export default class Slider extends React.Component {
  dragger = React.createRef()
  track = React.createRef()

  newPosition = 0
  oldPosition = 0

  min = 0
  max = 0

  state = {
    value: 0
  }

  componentDidMount() {
    this.setMinMaxValue()
    window.addEventListener('resize', this.onWidowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWidowResize)
  }

  onDragStart = event => {
    event.preventDefault()
    setCursorGlobal('ew-resize')

    this.oldPosition = event.clientX

    // add event listeners
    document.onmouseup = this.onDragEnd
    document.onmousemove = this.onDrag
  }

  onDrag = event => {
    event.preventDefault()
    const dragger = this.dragger.current
    const newPosition = event.clientX

    this.newPosition = this.oldPosition - newPosition
    this.oldPosition = newPosition

    // set the element's new position:
    const left = dragger.offsetLeft - this.newPosition
    if (left > this.max || left < this.min) return

    this.setElementLeft(left, dragger)
    this.calculateValue()
  }

  setElementLeft = (left, element) => (element.style.left = `${left}px`)

  onDragEnd = () => {
    setCursorGlobal('auto')
    document.onmouseup = null
    document.onmousemove = null
  }

  setMinMaxValue = () => {
    const { width: trackWidth } = this.track.current.getBoundingClientRect()
    const { width: draggerWidth } = this.dragger.current.getBoundingClientRect()

    this.max = trackWidth - draggerWidth
  }

  getDraggerLeftValue = () => parseFloat(this.dragger.current.style.left)

  calculateValue = debouce(100, () => {
    const percentage = this.getDraggerLeftValue() / this.max

    this.setState({
      value: percentage.toFixed(2)
    })
  })

  onWidowResize = () => {
    this.setMinMaxValue()
    this.setElementLeft(0, this.dragger.current) // to make sure the dragger comes back
    this.calculateValue()
  }

  render() {
    return (
      <div className="slider">
        <div className="slider__track" ref={this.track}>
          <div
            className="slider__dragger"
            ref={this.dragger}
            onMouseDown={this.onDragStart}
          />
        </div>

        <div className="slider__value">{Math.round(this.state.value * 100)}%</div>
      </div>
    )
  }
}
