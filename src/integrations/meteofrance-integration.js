import Data from '../data';

const STATE_GREEN  = 'Vert';
const STATE_YELLOW = 'Jaune';
const STATE_ORANGE = 'Orange';
const STATE_RED    = 'Rouge';

const EVENT_WIND          = 'Vent violent';
const EVENT_SNOW_ICE      = 'Neige-verglas';
const EVENT_THUNDERSTORMS = 'Orages';
const EVENT_FLOOD         = 'Inondation';
const EVENT_RAIN_FLOOD    = 'Pluie-inondation';

export class MeteoFranceIntegration
{
	static get name()
	{
		return 'meteofrance';
	}

	static getStatesLevels()
	{
		return {
			[STATE_YELLOW]: Data.getLevelByID(1),
			[STATE_ORANGE]: Data.getLevelByID(2),
			[STATE_RED]:    Data.getLevelByID(3),
		};
	}

	static getEventsTypes()
	{
		return {
			[EVENT_WIND]:          Data.getEventByName('Wind'),
			[EVENT_SNOW_ICE]:      Data.getEventByName('Snow/Ice'),
			[EVENT_THUNDERSTORMS]: Data.getEventByName('Thunderstorms'),
			[EVENT_FLOOD]:         Data.getEventByName('Flood'),
			[EVENT_RAIN_FLOOD]:    Data.getEventByName('Rain-Flood')
		};
	}

	static supports(entity)
	{
		return entity.attributes.attribution == 'Data provided by Météo-France' && entity.attributes[EVENT_WIND] != undefined;
	}

	static isWarningActive(entity)
	{
		return entity.state !== STATE_GREEN;
	}

	static getResult(entity)
	{
		const level = entity.state;
		let events = [];

		for(const [eventName, event] of Object.entries(this.getEventsTypes()))
		{
			const eventLevel = entity.attributes[eventName];
			if(eventLevel == level)
			{
				events.push(event);
			}
		}

		return {
			awarenessLevel: this.getStatesLevels()[level],
			awarenessType: Data.filterEvents(events)[0]
		};
	}
}