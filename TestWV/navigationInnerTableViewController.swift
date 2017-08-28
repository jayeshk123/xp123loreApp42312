//
//  navigationInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 03/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import MapboxNavigation
import MapboxDirections
import GRDB
import Toaster

class navigationInnerTableViewController: UITableViewController,MGLMapViewDelegate, CLLocationManagerDelegate {

    @IBOutlet var bikingClicked: UIButton!
    @IBOutlet var drivingClicked: UIButton!
    @IBOutlet var publicTransitClicked: UIButton!
    @IBOutlet var walkingClicked: UIButton!
    
    var lats:[Float] = []
    var longs:[Float] = []
    var center:CLLocationCoordinate2D? = nil
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
    func getSelectedCount() -> Int{
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience where selected = '1'")! // Int
                
                print("Count : \(elCount)")
                
            }
            return elCount
            
        } catch {
            print(error.localizedDescription)
            return 0
        }
    }
    
    func determineMyCurrentLocation() {
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        // Call stopUpdatingLocation() to stop listening for location updates,
        // other wise this function will be called every time when user location changes.
        
        // manager.stopUpdatingLocation()
        
        print("user latitude = \(userLocation.coordinate.latitude)")
        print("user longitude = \(userLocation.coordinate.longitude)")
        
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }
    
    public func getWaypoints(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience where selected = '1'")! // Int
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience where selected = '1'")
                    while let row = try rows.next() {
                        let latitude: String = row.value(named: "lattitude")
                        let longitude: String = row.value(named: "longitude")
                        
                        let lat = (latitude as NSString).floatValue
                        let long = (longitude as NSString).floatValue
                        
                        lats.append(lat)
                        longs.append(long)
                        
                    }
                    
                }
            }
        }catch {
            print(error.localizedDescription)
        }
        
    }
    
    @IBAction func walkingClicked(_ sender: Any) {
        
        let count = getSelectedCount()
        
        
        /*let latitude = locManager.location?.coordinate.latitude
        let longitude = locManager.location?.coordinate.longitude
        print(latitude)
        print(longitude)
        */
        
        if count >= 1 {
            var waypoints1:[Waypoint] = []
            self.getWaypoints()
           waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)), name: "Waypoint"))
            for i in 0 ..< self.lats.count {
                print(CLLocationDegrees(self.lats[i]))
                print(CLLocationDegrees(self.longs[i]))
                waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(self.lats[i]), longitude: CLLocationDegrees(self.longs[i])), name: "Waypoint"+String(i)))
                
            }
            self.lats.removeAll()
            self.longs.removeAll()
            print(waypoints1)
            let options = RouteOptions(waypoints: waypoints1, profileIdentifier: .walking)
            //options.routeShapeResolution = .full
            options.includesSteps = true
            waypoints1.removeAll()
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)

            }
        }else{
            Toast(text: "Please select two points to navigate").show()
        }
        
        

    }
    
    @IBAction func bikingClicked(_ sender: Any) {
        
        let count = getSelectedCount()
        
        
        if count >= 1 {
            var waypoints1:[Waypoint] = []
            self.getWaypoints()
            waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)), name: "Waypoint"))
            for i in 0 ..< self.lats.count {
                print(CLLocationDegrees(self.lats[i]))
                print(CLLocationDegrees(self.longs[i]))
                waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(self.lats[i]), longitude: CLLocationDegrees(self.longs[i])), name: "Waypoint"+String(i)))
                
            }
            self.lats.removeAll()
            self.longs.removeAll()
            
            
            print(waypoints1)
            
            let options = RouteOptions(waypoints: waypoints1, profileIdentifier: .cycling)
            //options.routeShapeResolution = .full
            options.includesSteps = true
            
            waypoints1.removeAll()
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)
            }
        }else{
            Toast(text: "Please select two points to navigate").show()
        }
        

    }
    
    @IBAction func drivingClicked(_ sender: Any) {
        
        let count = getSelectedCount()
        
        
        if count >= 1 {
            var waypoints1:[Waypoint] = []
            self.getWaypoints()
            waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)), name: "Waypoint"))
            for i in 0 ..< self.lats.count {
                
                waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(self.lats[i]), longitude: CLLocationDegrees(self.longs[i])), name: "Waypoint"+String(i)))
            }
            self.lats.removeAll()
            self.longs.removeAll()
            print(waypoints1)
            let options = RouteOptions(waypoints: waypoints1, profileIdentifier: .automobileAvoidingTraffic)
            //options.routeShapeResolution = .full
            options.includesSteps = true
            waypoints1.removeAll()
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)
            }
        }else{
            Toast(text: "Please select two points to navigate").show()
        }
        
        

    }
    
    
    @IBAction func publicTransitClicked(_ sender: Any) {
        
        let count = getSelectedCount()
        
        if count >= 1 {
            var waypoints1:[Waypoint] = []
            self.getWaypoints()
            
            
            waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)), name: "Waypoint"))
            
            for i in 0 ..< self.lats.count {
                
                waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(self.lats[i]), longitude: CLLocationDegrees(self.longs[i])), name: "Waypoint"+String(i)))
            }
            self.lats.removeAll()
            self.longs.removeAll()
            print(waypoints1)
            let options = RouteOptions(waypoints: waypoints1, profileIdentifier: .automobile)
            //options.routeShapeResolution = .full
            options.routeShapeResolution = .full
            options.includesSteps = true
            waypoints1.removeAll()
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)
            }
        }else{
            Toast(text: "Please select two points to navigate").show()
        }
    }

    var dbQueue: DatabaseQueue!
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        
        // Ask for Authorisation from the User.
        self.locationManager.requestAlwaysAuthorization()
        
        // For use in foreground
        self.locationManager.requestWhenInUseAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self as? CLLocationManagerDelegate
            locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            locationManager.startUpdatingLocation()
        }
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        let button = UIButton.init(type: .custom)
        button.setImage(UIImage.init(named: "hamburger_menu"), for: UIControlState.normal)
        /*button.addTarget(self, action:#selector(ViewController.callMethod), for: UIControlEvents.touchUpInside)*/
        button.frame = CGRect.init(x: 0, y: 0, width: 30, height: 30) //CGRectMake(0, 0, 30, 30)
        let barButton = UIBarButtonItem.init(customView: button)
        self.navigationItem.leftBarButtonItem = barButton
        
        let button1 = UIButton.init(type: .custom)
        button1.setImage(UIImage.init(named: "user_top_right"), for: UIControlState.normal)
        /*button.addTarget(self, action:#selector(ViewController.callMethod), for: UIControlEvents.touchUpInside)*/
        button1.frame = CGRect.init(x: 0, y: 0, width: 30, height: 30) //CGRectMake(0, 0, 30, 30)
        let barButton1 = UIBarButtonItem.init(customView: button1)
        self.navigationItem.rightBarButtonItem = barButton1
    }
    
    func locationManager(manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let locValue:CLLocationCoordinate2D = manager.location!.coordinate
        print("locations = \(locValue.latitude) \(locValue.longitude)")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 3
    }

    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
