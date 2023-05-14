import { createEffect, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import {
  SettingsCreateDocument,
  SettingsDocument,
  SettingsUpdateDocument,
} from "~/graphql/schema"
import { GrafbaseRequest } from "~/pages/App"

export type Settings = {
  id?: string
  hideActionBar: Boolean
  iconOnlySidebar: Boolean
  languageModelUsed: string // TODO: for some reason this is giving an error with grafbase..
}

// TODO: sync languageModelUsed too, gives grafbase errors..
export function createSettingsState(options: { request: GrafbaseRequest }) {
  const [settings, setSettings] = createStore<Settings>({
    hideActionBar: false,
    iconOnlySidebar: false,
    languageModelUsed: "gpt-3",
  })

  // TODO: this is really dumb, there has to be a better way to do this
  // all users have settings by default with default values
  // you shouldn't have to create them in front end code like this...
  onMount(() => {
    options.request(SettingsDocument).then(async (res) => {
      // if there are no settings, create them and put id in local store
      if (res.settingsCollection?.edges?.length === 0) {
        const res = options.request(SettingsCreateDocument, {
          settings: {}, // use default values
        })
        setSettings({ ...settings, id: res.settingsCreate?.settings?.id! })
        return
      } else {
        setSettings({
          ...settings,
          id: res.settingsCollection?.edges![0]?.node.id,
        })
      }
    })
  })

  // TODO: not sure how good this is..
  // should sync settings to grafbase when settings local store changes..
  createEffect(() => {
    // TODO: should not run on first load of the app..
    if (settings.id) {
      // if settings change, update db
      options.request(SettingsUpdateDocument, {
        id: settings.id,
        settings: {
          hideActionBar: settings.hideActionBar,
          iconOnlySidebar: settings.iconOnlySidebar,
          languageModelUsed: settings.languageModelUsed,
        },
      })
    }
  })

  return {
    // state
    settings,
    // actions
    toggleHideActionBar: () =>
      setSettings({ hideActionBar: !settings.hideActionBar }),
    toggleIconOnlySidebar: () =>
      setSettings({ iconOnlySidebar: !settings.iconOnlySidebar }),
    setlanguageModelUsed: (model: string) =>
      setSettings({ languageModelUsed: model }),
  }
}
