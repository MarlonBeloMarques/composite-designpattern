interface EventActions {
  add(): void
  view(): void
}

interface EventStatus {
  parent?: EventStatus
  readonly isDisabled: boolean

  disable(event?: EventStatus): boolean | void
}

class Facebook implements EventActions, EventStatus {
  parent?: EventStatus
  isDisabled: boolean

  disable(event?: EventStatus): boolean {
    this.isDisabled = true
    return this.isDisabled
  }
  add(): void {
    if(!this.isDisabled) {
      console.log('Facebook: add')
    }
  }
  view(): void {
    if(!this.isDisabled) {
      console.log('Facebook: view')
    }
  }
}

class Firebase implements EventActions, EventStatus {
  parent?: EventStatus
  isDisabled: boolean
  
  disable(event?: EventStatus | undefined): boolean {
    this.isDisabled = true
    return this.isDisabled
  }
  add(): void {
    if(!this.isDisabled) {
      console.log('Firebase: add')
    }
  }
  view(): void {
    if(!this.isDisabled) {
      console.log('Firebase: view')
    }
  }
}

class Analytics implements EventActions, EventStatus {
  parent?: EventStatus
  isDisabled: boolean


  disable(event?: EventStatus | undefined): boolean {
    this.isDisabled = true
    return this.isDisabled
  }
  add(): void {}
  view(): void {}
}

type EventUseCase = EventStatus & EventActions

class EventComposite implements EventActions, EventStatus {
  parent?: EventStatus
  isDisabled: boolean

  constructor(private readonly events: Array<EventUseCase>) {}

  disable(event?: EventStatus): boolean | void {
    if(event?.parent === undefined) {
      this.completeForEachEventsWith((eventOfList) => {
        if(eventOfList.parent === event) {
          eventOfList.disable()
        }
      })
    }

    if(event?.parent) {
      event?.disable()
    }
  }
  add(): void {
    this.completeForEachEventsWith((event) => {
      event.add()
    })
  }
  view(): void {
    this.completeForEachEventsWith((event) => {
      event.view()
    })
  }

  private completeForEachEventsWith(complete: (event: EventUseCase) => void) {
    this.events.forEach((event) => {
      complete(event)
    })
  }
}

const main = () => {
  const analytics = new Analytics();
  const facebook = new Facebook()
  facebook.parent = analytics
  const firebase = new Firebase()
  firebase.parent = analytics

  const composite = new EventComposite([analytics, facebook, firebase])

  composite.disable(facebook)

  composite.view()
  composite.add()
}

main()