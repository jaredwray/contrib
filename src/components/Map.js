import React from "react"
import Link from 'next/link'
import { Map, Marker, Popup, TileLayer, Tooltip, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerIcon from '../../public/content/svg/marker.svg'
import MarkerIconHighlight from '../../public/content/svg/marker-hover.svg'
import Stars from './Stars'

const MapComponent = props => {
    let tileLayers = []
    tileLayers[1] = { tiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd' }
    tileLayers[2] = { tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    tileLayers[3] = { tiles: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    tileLayers[4] = { tiles: 'https://mapserver.mapy.cz/base-m/{z}-{x}-{y}', attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://seznam.cz">Seznam.cz, a.s.</a>' }
    tileLayers[5] = { tiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd' }
    tileLayers[6] = { tiles: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a>' }

    const [hover, setHover] = React.useState(false)
    const [focus, setFocus] = React.useState(false)

    const icon = L.icon({
        iconUrl: MarkerIcon,
        shadowUrl: '',
        iconRetinaUrl: MarkerIcon,
        iconSize: [25, 37.5],
        popupAnchor: [0, -18],
        tooltipAnchor: [0, 19]
    })

    const highlightIcon = L.icon({
        iconUrl: MarkerIconHighlight,
        shadowUrl: '',
        iconRetinaUrl: MarkerIconHighlight,
        iconSize: [25, 37.5],
        popupAnchor: [0, -18],
        tooltipAnchor: [0, 19]
    })

    const markers = props.geoJSON && props.geoJSON.features && props.geoJSON.features.map(feature =>
        [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
        ]
    )

    return (
        <Map
            center={props.center && props.center}
            zoom={props.zoom}
            scrollWheelZoom={focus}
            className={props.className}
            dragging={props.dragging}
            tap={props.tap}
            bounds={props.geoJSON ? markers : null}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
        >
            <TileLayer
                url={tileLayers[1].tiles}
                attribution={tileLayers[1].attribution}

            />
            {props.geoJSON && props.geoJSON.features && props.geoJSON.features.map(feature => {
                const data = feature.properties
                return (
                    props.popupVenue ?
                        <Marker
                            key={data.id}

                            position={[
                                feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}

                            onMouseOver={() => {
                                setHover(data.id)
                            }}
                            onMouseOut={() => {
                                setHover(false)
                            }}
                            icon={hover === data.id || props.hoverCard === feature.properties.id ? highlightIcon : icon}
                        >

                            <Popup className="map-custom-popup" maxWidth="600" minWidth="200">
                                <div className="popup-venue">
                                    {data.image ?
                                        <div
                                            className={`image d-none d-md-block`}
                                            style={{ backgroundImage: `url(/content/img/photo/${data.image})` }}
                                        />
                                        :
                                        <div className="image" />
                                    }
                                    <div className="text">
                                        {data.name &&
                                            <h6>
                                                <Link href={data.link}>
                                                    <a>
                                                        {data.name}
                                                    </a>
                                                </Link>
                                            </h6>
                                        }
                                        {data.about &&
                                            <p>
                                                {data.about}
                                            </p>
                                        }
                                        {data.address &&
                                            <p className="text-muted mb-1">
                                                {data.address}
                                            </p>
                                        }
                                        {data.email &&
                                            <p className="text-muted mb-1">
                                                <i className="fas fa-envelope-open fa-fw text-dark mr-2" />
                                                <a href={`mailto:${data.email}`}>
                                                    {data.email}
                                                </a>

                                            </p>
                                        }
                                        {data.phone &&
                                            <p className="text-muted mb-1">
                                                <i className="fa fa-phone fa-fw text-dark mr-2" />
                                                {data.phone}

                                            </p>
                                        }
                                    </div>
                                </div>

                            </Popup>
                        </Marker>
                        :
                        <Marker
                            key={data.id}
                            icon={icon}
                            opacity={0}
                            position={[
                                feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                            onMouseOver={() => {
                                setHover(data.id)
                            }}
                            onMouseOut={() => {
                                setHover(false)
                            }}
                        >
                            <Tooltip
                                permanent={true}
                                interactive={true}
                                direction="top"

                                className={`map-custom-tooltip ${hover === data.id || props.hoverCard === feature.properties.id ? 'active' : ''}`}

                            >
                                ${data.price}
                            </Tooltip>

                            <Popup className="map-custom-popup" maxWidth="600" minWidth="200">

                                <div className="popup-rental">
                                    {data.image ?
                                        <div
                                            className={`image d-none d-md-block`}
                                            style={{ backgroundImage: `url(/content/img/photo/${data.image})` }}
                                        />
                                        :
                                        <div className="image" />
                                    }
                                    <div className="text">
                                        {data.name &&
                                            <h6>
                                                <Link href={data.link}>
                                                    <a>
                                                        {data.name}
                                                    </a>
                                                </Link>
                                            </h6>
                                        }
                                        <div className="text-xs">
                                            <Stars stars={data.stars} />
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                )
            }
            )}
            {props.markerPosition &&
                <Marker
                    position={props.markerPosition}
                    icon={icon}
                />
            }
            {props.circlePosition &&
                <Circle
                    center={props.circlePosition}
                    color={'#4E66F8'}
                    fillColor={'#8798fa'}
                    opacity={.5}
                    radius={props.circleRadius}
                    weight={2}
                />
            }
        </Map>
    )
}

export default MapComponent