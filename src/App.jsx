/* eslint-disable no-undef */
import { Box, Button,  ButtonGroup,  Flex, HStack, IconButton, Input, Text,} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useRef, useState } from 'react'


const center = { lat: 19.348, lng: -99.163 }



function App() {


  
  
  const { isLoaded } = useJsApiLoader({
    // eslint-disable-next-line no-undef
    googleMapsApiKey: import.meta.env.VITE_APP_ENV,
    libraries: ['places']
  })

  const [map, setMap] = useState( /**@type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('');

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()

  if (!isLoaded) {
    return map
  }

  async function calculeRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }

    // eslint-disable-next-line no-undef
    const directionServer = new google.maps.DirectionsService()
    const reuslts = await directionServer.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })

    setDirectionsResponse(reuslts);
    setDistance(reuslts.routes[0].legs[0].distance.text)
    setDuration(reuslts.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance(null)
    setDuration(null)
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgPos='bottom'
      h='100vh'
      w='100vw'
    >
    <div className='flex flex-col relative items-center w-full h-f'>

    </div>
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* google maps */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && <DirectionsRenderer directions={directionsResponse}/> }
        </GoogleMap>


      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input type='text' placeholder='Origen' ref={originRef} />
          </Autocomplete>

          <Autocomplete>
            <Input type='text' placeholder='Destino' ref={destinationRef} />
          </Autocomplete>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculeRoute}>
              Calcular ruta
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distancia: {distance} </Text>
          <Text>Duración: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
