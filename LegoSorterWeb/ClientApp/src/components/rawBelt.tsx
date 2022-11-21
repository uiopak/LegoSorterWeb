import { useParams, useSearchParams } from '@solidjs/router';
import Belt from '../pages/belt';

export default function RawBelt() {
    const [searchParams, setSearchParams] = useSearchParams();
    var speed = searchParams.speed ? parseFloat(searchParams.speed).toString() : "1.0"
    var camera = searchParams.camera ? searchParams.camera == "1" : false
    var opacity = searchParams.opacity ? parseInt(searchParams.opacity).toString() : "100"
    if (camera) {
        speed = "0"
    }
    return(
        <Belt gui={false} default_speed={speed} default_opacity={opacity} camera_view={camera} />
    )
}