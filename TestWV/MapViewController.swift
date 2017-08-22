//
//  MapViewController.swift
//  TestWV
//
//  Created by earth on 20/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Cordova
import Mapbox
import GRDB
import NVActivityIndicatorView
import MapboxDirections
import MapboxNavigation
import Alamofire
import SwiftyJSON
import Toaster

//import AZTabBar

class MapViewController: UIViewController, MGLMapViewDelegate, CLLocationManagerDelegate, NVActivityIndicatorViewable {
    
    @IBOutlet var mainFrameMapView: UIView!
    var unId = 0
    var URL = "http://34.231.31.72/xplore/index.php"
   // @IBOutlet weak var mapView: MGLMapView!
    
    let locationManager = CLLocationManager()
    var mapView: MGLMapView!
    var progressView: UIProgressView!
    
    var lats:[Float] = []
    var longs:[Float] = []
    
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
    
    @IBAction func startNavigationClicked(_ sender: Any) {
        print("TEST")
        
        let refreshAlert = UIAlertController(title: "Start Navigation", message: "Select navigation type.", preferredStyle: UIAlertControllerStyle.alert)
        
        refreshAlert.addAction(UIAlertAction(title: "2 Points", style: .default, handler: { (action: UIAlertAction!) in
            var waypoints1:[Waypoint] = []
            
            let origin = (Waypoint(coordinate: CLLocationCoordinate2D(latitude: 41.858024, longitude: -87.657773),coordinateAccuracy: -1, name: "Origin"))
            let dest = (Waypoint(coordinate: CLLocationCoordinate2D(latitude: 41.86948904, longitude: -87.6257986),coordinateAccuracy: -1, name: "Dest"))
            print(waypoints1)
            let options = RouteOptions(waypoints: [origin, dest], profileIdentifier: .walking)
            options.routeShapeResolution = .full
            options.includesSteps = true
            
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)
            }

        }))
        
        refreshAlert.addAction(UIAlertAction(title: "5 Points", style: .cancel, handler: { (action: UIAlertAction!) in
            var waypoints1:[Waypoint] = []
            self.getWaypoints()
            for i in 0 ..< self.lats.count {
                
                waypoints1.append(Waypoint(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(self.lats[i]), longitude: CLLocationDegrees(self.longs[i])), name: "Waypoint"+String(i)))
                
            }
            
            print(waypoints1)
            let options = RouteOptions(waypoints: waypoints1, profileIdentifier: .automobileAvoidingTraffic)
            options.routeShapeResolution = .full
            options.includesSteps = true
            
            Directions.shared.calculate(options) { (waypoints, routes, error) in
                guard let route = routes?.first else { return }
                
                let viewController = NavigationViewController(for: route)
                self.present(viewController, animated: true, completion: nil)
            }
        }))
        
        present(refreshAlert, animated: true, completion: nil)

        
        
        
    }
    
    public func getWaypoints(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience")
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
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        setUpDatabasePath()
        //view.backgroundColor = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        mapView = MGLMapView(frame: view.bounds, styleURL: MGLStyle.lightStyleURL())
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        //mapView.tintColor = .gray
        mapView.delegate = self
        //mainFrameMapView.addSubview(mapView)
        view.addSubview(mapView)
        
        
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience")
                    while let row = try rows.next() {
                        let latitude: String = row.value(named: "lattitude")
                        let longitude: String = row.value(named: "longitude")
                        let name: String = row.value(named: "name")
                        let desc: String = row.value(named: "location")
                        let unid: String = row.value(named: "uniqueId")
                        
                        let lat = (latitude as NSString).floatValue
                        let long = (longitude as NSString).floatValue
                        let hello = MGLPointAnnotation()
                        hello.coordinate = CLLocationCoordinate2D(latitude: CLLocationDegrees(lat) , longitude: CLLocationDegrees(long))
                        hello.title = name
                        hello.subtitle = desc+"__"+String(unid)
                        
                        mapView.addAnnotation(hello)
                    }
                    
                }
            }
        }catch {
            print(error.localizedDescription)
        }
        
       /* // Setup offline pack notification handlers.
        NotificationCenter.default.addObserver(self, selector: #selector(offlinePackProgressDidChange), name: NSNotification.Name.MGLOfflinePackProgressChanged, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(offlinePackDidReceiveError), name: NSNotification.Name.MGLOfflinePackError, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(offlinePackDidReceiveMaximumAllowedMapboxTiles), name: NSNotification.Name.MGLOfflinePackMaximumMapboxTilesReached, object: nil)
        */
        
        
        self.locationManager.delegate = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest
        self.locationManager.requestWhenInUseAuthorization()
        self.locationManager.startUpdatingLocation()
        
        
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation])
    {
        let location = locations.last
        //let mapView = MGLMapView(frame: view.bounds)
        mapView.userTrackingMode = .follow
        let center = CLLocationCoordinate2D(latitude: location!.coordinate.latitude, longitude: location!.coordinate.longitude)
        mapView.setCenter(center, zoomLevel: 18, animated: true)
        view.addSubview(mapView)
        //mainFrameMapView.addSubview(mapView)
        self.locationManager.stopUpdatingLocation()
    }
    
    public func getUniqueId(lat:String, long:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                let rows = try Row.fetchCursor(db, "SELECT * FROM experience where lattitude = ? and longitude = ?" , arguments:[lat, long])
                while let row = try rows.next() {
                    let uniqueId: String = row.value(named: "uniqueId")
                    print(uniqueId)
                    unId = Int(uniqueId)!
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience where lattitude = ? and longitude = ?",arguments:[lat, long])! // Int
                print("Count : \(elCount)")
                if elCount == 0{
                    unId = 0
                }
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }

    
    func mapView(_ mapView: MGLMapView, tapOnCalloutFor annotation: MGLAnnotation) {
        print("tap on callout")
        print(annotation)
        print(annotation.title as Any)
        print(annotation.coordinate)
        
        var myStringArr = annotation.subtitle??.components(separatedBy: "__")
        
        
        
            //getUniqueId(lat: String(annotation.coordinate.latitude), long: String(annotation.coordinate.longitude))
            let newURL = "/site/getPlaceProfileNative?SrNumber="+(myStringArr?[1])!
            if(unId == 0){
                let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
            Alamofire.request(self.URL + newURL).responseString { response in
                print("Request: \(String(describing: response.request))")   // original url request
                print("Response: \(String(describing: response.response))") // http url response
                print("Result: \(response.result)")
                // response serialization result
                
                if let json = response.data {
                    let data = JSON(data: json)
                    print(data)
                    let id : Int = data["SrNumber"].intValue
                    let title : String = data["Detail"]["name"].stringValue
                    let address : String = data["Detail"]["address"].stringValue
                    let distance : String = ""
                    let website : String = data["Detail"]["Website"].stringValue
                    let latitude : String = data["Detail"]["Website"].stringValue
                    let longitude : String = data["Detail"]["Website"].stringValue
                    let description : String = data["Detail"]["about"].stringValue
                    let image : String = data["Detail"]["profileimage"].stringValue
                    let phone : String = data["Detail"]["Phone"].stringValue
                    let foursquareRating : String = "4.5"
                    let yelpRating : String = "4.2"
                    let quality : String = "4"
                    let totalReviews : String = "24"
                    let avgRating : String = "4.1"
                    
                    print("Image \(image)")
                    
                    self.savePlaceProfile(Index: id, title: title, address: address, distance: distance, website: website, lattitude: latitude, longitude: longitude, description: description, image: image, phone: phone, foursquareRating: foursquareRating, yelpRating: yelpRating, quality: quality, totalReviews: totalReviews, avgRating: avgRating)
                }
            }
            
        }else{
            Toast(text: "Unable to fetch id for the place")
        }
        
        
    }
    
    public func savePlaceProfile(Index:Int, title:String, address:String, distance:String, website:String, lattitude:String, longitude:String, description:String, image:String, phone:String, foursquareRating:String, yelpRating:String, quality:String, totalReviews:String, avgRating:String){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                try db.execute(
                    "delete from placeProfile")
                
                try db.execute(
                    "INSERT INTO placeProfile (uniqueID, name, address, distance, website, lattitude, longitude, description, image, phone, foursquareRating, yelpRating, quality, totalReviews, avgRating) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    arguments: [Index, title, address, distance, website, lattitude, longitude, description, image, phone, foursquareRating, yelpRating, quality, totalReviews, avgRating])
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                    let sectionIndex: String = row.value(named: "uniqueID")
                    print(sectionIndex)
                }
                
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM placeProfile")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT uniqueID FROM placeProfile")
                print("Count : \(elCount)")
                
                NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                let newViewController = storyBoard.instantiateViewController(withIdentifier: "placeProfile")
                self.present(newViewController, animated: true, completion: nil)
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }

    
    func  locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print ("Errors:" + error.localizedDescription)
    }
    
    func mapViewDidFinishLoadingMap(_ mapView: MGLMapView) {
        // Start downloading tiles and resources for z13-16.
        //startOfflinePackDownload()
    }
    
    deinit {
        // Remove offline pack observers.
        NotificationCenter.default.removeObserver(self)
    }
    
    func startOfflinePackDownload() {
        
        // Create a region that includes the current viewport and any tiles needed to view it when zoomed further in.
        // Because tile count grows exponentially with the maximum zoom level, you should be conservative with your `toZoomLevel` setting.
        let region = MGLTilePyramidOfflineRegion(styleURL: mapView.styleURL, bounds: mapView.visibleCoordinateBounds, fromZoomLevel: mapView.zoomLevel, toZoomLevel: 16)
        
        // Store some data for identification purposes alongside the downloaded resources.
        let userInfo = ["name": "My Offline Pack"]
        let context = NSKeyedArchiver.archivedData(withRootObject: userInfo)
        
        // Create and register an offline pack with the shared offline storage object.
        
        MGLOfflineStorage.shared().addPack(for: region, withContext: context) { (pack, error) in
            guard error == nil else {
                // The pack couldn’t be created for some reason.
                print("Error: \(error?.localizedDescription ?? "unknown error")")
                return
            }
            
            // Start downloading.
            pack!.resume()
        }
        
    }
    
    // Use the default marker. See also: our view annotation or custom marker examples.
    func mapView(_ mapView: MGLMapView, viewFor annotation: MGLAnnotation) -> MGLAnnotationView? {
        return nil
    }
    
    // Allow callout view to appear when an annotation is tapped.
    func mapView(_ mapView: MGLMapView, annotationCanShowCallout annotation: MGLAnnotation) -> Bool {
        return true
    }
    
    // MARK: - MGLOfflinePack notification handlers
    
    func offlinePackProgressDidChange(notification: NSNotification) {
        // Get the offline pack this notification is regarding,
        // and the associated user info for the pack; in this case, `name = My Offline Pack`
        if let pack = notification.object as? MGLOfflinePack,
            let userInfo = NSKeyedUnarchiver.unarchiveObject(with: pack.context) as? [String: String] {
            let progress = pack.progress
            // or notification.userInfo![MGLOfflinePackProgressUserInfoKey]!.MGLOfflinePackProgressValue
            let completedResources = progress.countOfResourcesCompleted
            let expectedResources = progress.countOfResourcesExpected
            
            // Calculate current progress percentage.
            let progressPercentage = Float(completedResources) / Float(expectedResources)
            
            // Setup the progress bar.
            /*if progressView == nil {
                progressView = UIProgressView(progressViewStyle: .default)
                let frame = view.bounds.size
                progressView.frame = CGRect(x: frame.width / 4, y: frame.height * 0.75, width: frame.width / 2, height: 10)
                view.addSubview(progressView)
            }
            
            progressView.progress = progressPercentage*/
            
            // If this pack has finished, print its size and resource count.
            if completedResources == expectedResources {
                let byteCount = ByteCountFormatter.string(fromByteCount: Int64(pack.progress.countOfBytesCompleted), countStyle: ByteCountFormatter.CountStyle.memory)
                print("Offline pack “\(userInfo["name"] ?? "unknown")” completed: \(byteCount), \(completedResources) resources")
            } else {
                // Otherwise, print download/verification progress.
                print("Offline pack “\(userInfo["name"] ?? "unknown")” has \(completedResources) of \(expectedResources) resources — \(progressPercentage * 100)%.")
            }
        }
    }
    
    func offlinePackDidReceiveError(notification: NSNotification) {
        if let pack = notification.object as? MGLOfflinePack,
            let userInfo = NSKeyedUnarchiver.unarchiveObject(with: pack.context) as? [String: String],
            let error = notification.userInfo?[MGLOfflinePackUserInfoKey.error] as? NSError {
            print("Offline pack “\(userInfo["name"] ?? "unknown")” received error: \(error.localizedFailureReason ?? "unknown error")")
        }
    }
    
    func offlinePackDidReceiveMaximumAllowedMapboxTiles(notification: NSNotification) {
        if let pack = notification.object as? MGLOfflinePack,
            let userInfo = NSKeyedUnarchiver.unarchiveObject(with: pack.context) as? [String: String],
            let maximumCount = (notification.userInfo?[MGLOfflinePackUserInfoKey.maximumCount] as AnyObject).uint64Value {
            print("Offline pack “\(userInfo["name"] ?? "unknown")” reached limit of \(maximumCount) tiles.")
        }
    }
}
