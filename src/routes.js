
import App from './components/App';
import LiveSensors from  './components/LiveSensors';
import HistoSensors from  './components/HistoSensors';
import Sensor from  './components/Sensor';
import SensorsHisto from  './components/SensorsHisto';
import BrokerStatus from './components/BrokerStatus'

export const getRoutes = (store) => {
const routes = [{
  path: '/',
  component: App,
  //indexRoute: { onEnter: (nextState, replace) => replace('/livefeed') },
  childRoutes: [
    { name:'live',
      path:'/livefeed',
      component: LiveSensors,
      childRoutes: [
        { name: 'live_sensor',
          path:'/livefeed/:id',
          component: Sensor,
          onEnter: (nextState, replace) => {
            const state = store.getState();
            if(state.sensors.filter((s) => (s.id === nextState.params.id)).length === 0 ){
              replace('/livefeed')
            }
          }
        }
      ],
      indexRoute: { name: 'broker_status', component: BrokerStatus },
    },
      {
          name:'histo',
          path:'/histo',
          component: HistoSensors,
          childRoutes: [
              { name: 'histo_sensor',
                  path:'/histo/:id',
                  component: SensorsHisto,
                  onEnter: (nextState, replace) => {
                      const state = store.getState();
                      if(state.sensors.filter((s) => (s.id === nextState.params.id)).length === 0 ){
                          replace('/histo')
                      }
                  }
              }
          ],
      }
  ]
}]
return routes;
}

export default getRoutes
