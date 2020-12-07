import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export const useQuery = () => new URLSearchParams(useLocation().search);

export const useWindowUnloadEffect = (handler, callOnCleanup) => {

    const cb = useRef()
    cb.current = handler
    
    useEffect(() => {

      const handler = () => cb.current()

      window.addEventListener('beforeunload', handler)
      
      return () => {
        if(callOnCleanup) handler()
      
        window.removeEventListener('beforeunload', handler)
      }

    }, [cb])
}