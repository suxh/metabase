(ns metabase.models.dashboard-card
  (:require [clojure.set :as set]
            [korma.core :refer :all, :exclude [defentity]]
            [metabase.db :refer :all]
            (metabase.models [card :refer [Card]]
                             [interface :refer :all])))

(defentity DashboardCard
  [(table :report_dashboardcard)
   timestamped]

  IEntityPostSelect
  (post-select [_ {:keys [card_id dashboard_id] :as dashcard}]
    (-> dashcard
        (set/rename-keys {:sizex :sizeX ; mildly retarded: H2 columns are all uppercase, we're converting them
                          :sizey :sizeY}) ; to all downcase, and the Angular app expected mixed-case names here
        (assoc :card      (delay (Card card_id))
               :dashboard (delay (sel :one 'metabase.models.dashboard/Dashboard :id dashboard_id))))))

(defmethod pre-insert DashboardCard [_ dashcard]
  (let [defaults {:sizeX 2
                  :sizeY 2}]
    (merge defaults dashcard)))
