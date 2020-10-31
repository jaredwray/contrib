import React from 'react'
import dynamic from 'next/dynamic'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import geoJSONRestaurants from '../../../data/restaurants-geojson.json'
import geoJSONRooms from '../../../data/rooms-geojson.json'

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)
    React.useEffect(() => {
        Map = dynamic(
            () => import('../../Map'),
            { ssr: false }
        )
        setMapLoaded(true)

    }, [])

    return (
        <div id="maps" className="docs-item element">
            <h5 className="text-uppercase mb-4">Maps</h5>
            <div className="docs-desc">
                <p className="lead">
                    Maps inside this theme use React Leaflet and tiles from <a href="https://carto.com/">Carto Maps</a>.</p>
                <p>A big advantage compared to Google Maps is that these maps are free to use. For the map tiles, you can also use maps from Mapbox or OpenStreet maps.</p>
                <p><a href="https://react-leaflet.js.org/" className="btn btn-outline-dark btn-sm">React Leaflet website</a>
                </p>
                <p>
                    Since Next.js doesn't support JavaScript <code>window</code> function, we have to load the <code>Map</code> component dynamically using Next.js dynamic feature. Read more about dynamic importing <a href="https://nextjs.org/docs/advanced-features/dynamic-import">here</a>.
                </p>
                <h6 className="text-dark">Supported props for Map component:</h6>
                <ul>
                    <li><b>className</b> - classes for <code>Map</code> element</li>
                    <li><b>center</b> - map center</li>
                    <li><b>zoom</b> - zoom level</li>
                    <li><b>geoJSON</b> - geoJSON data import</li>
                    <li><b>popupVenue</b> - if true, the map will use <code>Venues</code> style (for markers and popups) instead of <code>Rentals</code></li>
                    <li><b>hoverCard</b> - here you define which listing is hovered to show hover effect on according map marker (used at /category listing pages)</li>
                </ul>

            </div>
            <div className="mt-5">
                <h6>Maps with multiple points</h6>

                <p className="text-muted">
                    Maps that are used in the category listings show multiple points/markers. Also, popup windows are automatically attached to these points. To display this type of map, you need to provide your list of points in a <a href="http://geojson.org/">GeoJSON file</a>. These files will contain location data and accompanying data like title, description, image path, etc. See below the links to the particular GeoJSON files used in this theme.
                </p>
                <h6 className="text-muted text-uppercase">Venues</h6>
                <p className="text-muted text-sm mb-4">GeoJSON file used to generate markers: <a href="/content/restaurants-geojson.json">restaurants-geojson.json</a></p>
                <div className="map-wrapper-450 mb-2">
                    {mapLoaded &&
                        <Map
                            className="h-100"
                            center={[51.505, -0.09]}
                            zoom={14}
                            geoJSON={geoJSONRestaurants}
                            dragging="true"
                            popupVenue
                        />
                    }
                </div>
                <div className="mt-4 mb-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.venues}
                    </SyntaxHighlighter>
                </div>
                <h6 className="text-muted text-uppercase">Rentals</h6>
                <p className="text-muted text-sm mb-4">GeoJSON file used to generate markers: <a href="/content/rooms-geojson.json">rooms-geojson.json</a></p>
                <div className="map-wrapper-450 mb-2">
                    {mapLoaded &&
                        <Map
                            className="h-100"
                            center={[51.505, -0.09]}
                            zoom={14}
                            geoJSON={geoJSONRooms}
                            dragging="true"
                        />
                    }
                </div>
                <div className="mt-4 mb-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.rentals}
                    </SyntaxHighlighter>
                </div>
                <h6>Maps with a single marker</h6>
                <p className="text-muted">Maps used on the detail pages do not contain popups and do not use a GeoJSON file. You pass all the data to the JavaScript function.</p>
                <h6 className="text-muted mb-4">Single-marker map</h6>
                <div className="map-wrapper-300 mb-3">
                    {mapLoaded &&
                        <Map
                            className="h-100"
                            center={[40.732346, -74.0014247]}
                            markerPosition={[40.732346, -74.0014247]}
                            zoom={16}
                            dragging="true"
                        />
                    }
                </div>
                <div className="mt-4 mb-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.single}
                    </SyntaxHighlighter>
                </div>
                <h6 className="text-muted mb-4">Single-marker map, circle instead of the marker</h6>
                <div className="map-wrapper-300 mb-3">
                    {mapLoaded &&
                        <Map
                            className="h-100"
                            center={[40.732346, -74.0014247]}
                            circlePosition={[40.732346, -74.0014247]}
                            circleRadius={500}
                            zoom={14}
                            dragging="true"
                        />
                    }
                </div>
                <div className="mt-4 mb-5">
                    <SyntaxHighlighter language="javascript" style={tomorrow} className="rounded shadow p-4">
                        {highlightCode.circle}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    )
}

const highlightCode = {
    "venues": (
        `import dynamic from 'next/dynamic'

import geoJSON from './public/content/rooms-geojson.json'

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )

        setMapLoaded(true)

    }, [])
    return (
        div className="map-wrapper-300 mb-3">
            {mapLoaded &&
                <Map
                    className="h-100"
                    center={[51.505, -0.09]}
                    zoom={14}
                    popupVenue
                    geoJSON={geoJSON}
                />
            }
        </div>
    )
}`),
    "rentals": (
        `import dynamic from 'next/dynamic'

import geoJSON from './public/content/rooms-geojson.json'

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )

        setMapLoaded(true)

    }, [])
    return (
        div className="map-wrapper-300 mb-3">
            {mapLoaded &&
                <Map
                    className="h-100"
                    center={[51.505, -0.09]}
                    zoom={14}
                    geoJSON={geoJSON}
                />
            }
        </div>
    )
}`),
    "single": (
        `import dynamic from 'next/dynamic'

import geoJSON from './public/content/rooms-geojson.json'

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )

        setMapLoaded(true)

    }, [])
    return (
        div className="map-wrapper-300 mb-3">
            {mapLoaded &&
                <Map
                    className="h-100"
                    center={[40.732346, -74.0014247]}
                    zoom={14}
                    geoJSON={geoJSON}
                />
            }
        </div>
    )
}`),
    "circle": (
        `import dynamic from 'next/dynamic'

import geoJSON from './public/content/rooms-geojson.json'

let Map
export default () => {
    const [mapLoaded, setMapLoaded] = React.useState(false)

    React.useEffect(() => {
        Map = dynamic(
            () => import('../components/Map'),
            { ssr: false }
        )

        setMapLoaded(true)

    }, [])
    return (
        div className="map-wrapper-300 mb-3">
            {mapLoaded &&
                <Map
                    className="h-100"
                    center={[40.732346, -74.0014247]}
                    circlePosition={[40.732346, -74.0014247]}
                    circleRadius={500}
                    zoom={14}
                    geoJSON={geoJSON}
                />
            }
        </div>
    )
}`)
}