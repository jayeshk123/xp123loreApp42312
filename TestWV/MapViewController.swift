//
//  MapViewController.swift
//  TestWV
//
//  Created by earth on 20/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
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
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet var mainFrameMapView: UIView!
    var unId = 0
    var URL = "http://34.231.31.72/xplore/index.php"
   // @IBOutlet weak var mapView: MGLMapView!
    
    let locationManager = CLLocationManager()
    var mapView: MGLMapView!
    var progressView: UIProgressView!
    
    var lats:[Float] = []
    var longs:[Float] = []
    
    var latCent:Float = 0.0
    var longCent:Float = 0.0
    
    var expCount:Int = 0
    
    var isTransformed:Bool = false
    
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
    
    @IBAction func backClicked(_ sender: UIBarButtonItem) {
        self.dismiss(animated: true, completion: nil)
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
                self.present(viewController, animated: false, completion: nil)
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
                expCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")!
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
    
    func togglelayer(sender:Any){
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
        self.present(newViewController, animated: true, completion: nil)

        
    }
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        /*let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView*/
        
        setUpDatabasePath()
        
        mapView = MGLMapView(frame: view.bounds, styleURL: MGLStyle.lightStyleURL())
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        //mapView.tintColor = .gray
        mapView.delegate = self
        mapView.logoView.isHidden = true
        mapView.attributionButton.isHidden = true
        //mainFrameMapView.addSubview(mapView)
        view.addSubview(mapView)
        //view.addSubview(containerView)
        let button = UIButton(type: .system)
        button.autoresizingMask = [.flexibleTopMargin, .flexibleLeftMargin, .flexibleRightMargin]
        button.setTitle("Toggle Layout", for: .normal)
        button.isSelected = true
        button.sizeToFit()
        button.center.x = self.view.center.x
        button.frame = CGRect(origin: CGPoint(x: button.frame.origin.x, y: self.view.frame.size.height - button.frame.size.height - 5), size: button.frame.size)
        button.addTarget(self, action: #selector(togglelayer(sender:)), for: .touchUpInside)
        
        mapView.addSubview(button)
        
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
                        
                        if latCent == 0.0 && longCent == 0.0 {
                            latCent = lat
                            longCent = long
                        }
                    }
                    
                }
            }
        }catch {
            print(error.localizedDescription)
        }
        
        
        if latCent != 0.0 && longCent != 0.0 {
            let center = CLLocationCoordinate2D(latitude: CLLocationDegrees(latCent), longitude: CLLocationDegrees(longCent))
            mapView.setCenter(center, zoomLevel: 12, animated: false)
            view.addSubview(mapView)
        }
        self.locationManager.delegate = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest
        self.locationManager.requestWhenInUseAuthorization()
        self.locationManager.startUpdatingLocation()
        
        
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation])
    {
        //let location = locations.last
        
        if latCent != 0.0 && longCent != 0.0 {
            mapView.userTrackingMode = .follow
            let center = CLLocationCoordinate2D(latitude: CLLocationDegrees(latCent), longitude: CLLocationDegrees(longCent))
            mapView.setCenter(center, zoomLevel: 12, animated: true)
            view.addSubview(mapView)
        }
        
        
        self.locationManager.stopUpdatingLocation()
    }
    
    public func getUniqueId(lat:String, long:String){
        do {
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
                    let coords = data["LatLng"]
                    
                    print(coords)
                    print(coords["H"])
                    print(coords["L"])
                    
                    let id : Int = data["SrNumber"].intValue
                    let title : String = data["Detail"]["name"].stringValue
                    let address : String = data["Detail"]["address"].stringValue
                    let distance : String = ""
                    let website : String = data["Detail"]["Website"].stringValue
                    let latitude : String = coords["H"].stringValue
                    let longitude : String = coords["L"].stringValue
                    let description : String = data["Detail"]["about"].stringValue
                    let image : String = data["Detail"]["Path"].stringValue
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
                self.present(newViewController, animated: false, completion: nil)
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
        
        NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
        
        
        
        // Start downloading tiles and resources for z13-16.
        //startOfflinePackDownload()
        
        /*if latCent != 0.0 && longCent != 0.0 {
            //let coordinate = CLLocationCoordinate2D(latitude: CLLocationDegrees(latCent) , longitude: CLLocationDegrees(longCent))
            
            //let camera = MGLMapCamera(lookingAtCenter: coordinate, fromEyeCoordinate: coordinate, eyeAltitude: 15000)
            
            
                
               /* MGLMapCamera(lookingAtCenter: coordinate, fromDistance: 4500, pitch: 13, heading: 0)*/
            //let camera1 = MGLMapCamera(lookingAtCenter: coordinate, fromDistance: 4500, pitch: 15, heading: 0)
            
            // Animate the camera movement over 5 seconds.
            
            //mapView.fly(to: camera)
            //mapView.fly(to: camera, withDuration: 3.5)
            
           /* let center = CLLocationCoordinate2D(latitude: CLLocationDegrees(latCent), longitude: CLLocationDegrees(longCent))
            mapView.setCenter(center, zoomLevel: 12, animated: false)*/
            //view.addSubview(mapView)

            
            //mapView.setCamera(camera, withDuration: 2, animationTimingFunction: CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut))
            
            /*let when = DispatchTime.now() + 3 // change 2 to desired number of seconds
            DispatchQueue.main.asyncAfter(deadline: when) {
                // Your code with delay
                 mapView.setCamera(camera1, withDuration: 2, animationTimingFunction: CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut))
            }*/
           
        }*/
        
    }
 
    
    deinit {
        // Remove offline pack observers.
        NotificationCenter.default.removeObserver(self)
    }
    
    
    // Use the default marker. See also: our view annotation or custom marker examples.
    func mapView(_ mapView: MGLMapView, viewFor annotation: MGLAnnotation) -> MGLAnnotationView? {
        return nil
    }
    
    // Allow callout view to appear when an annotation is tapped.
    func mapView(_ mapView: MGLMapView, annotationCanShowCallout annotation: MGLAnnotation) -> Bool {
        return true
    }
    
    
    /*var top = CGAffineTransform(translationX: 0, y: -100)
     
     if expCount <= 0{
     
     }else if expCount == 1{
     top = CGAffineTransform(translationX: 0, y: -100)
     }else if expCount == 2{
     top = CGAffineTransform(translationX: 0, y: -200)
     }else if expCount == 3{
     top = CGAffineTransform(translationX: 0, y: -300)
     }else{
     top = CGAffineTransform(translationX: 0, y: -300)
     }
     //Uncomment next line to make this dynamic. Some changes might be required
     top = CGAffineTransform(translationX: 0, y: -300)
     let bottom = CGAffineTransform(translationX: 0, y: 0)
     
     
     if isTransformed == false{
     isTransformed = true
     //let left = CGAffineTransform(translationX: -300, y: 0)
     //let right = CGAffineTransform(translationX: 300, y: 0)
     
     
     UIView.animate(withDuration: 0.4, delay: 0.0, options: [], animations: {
     // Add the transformation in this block
     // self.container is your view that you want to animate
     self.mapView.transform = top
     }, completion: nil)
     
     }else{
     isTransformed = false
     //let left = CGAffineTransform(translationX: -300, y: 0)
     //let right = CGAffineTransform(translationX: 300, y: 0)
     
     
     UIView.animate(withDuration: 0.4, delay: 0.0, options: [], animations: {
     // Add the transformation in this block
     // self.container is your view that you want to animate
     self.mapView.transform = bottom
     }, completion: nil)
     
     }*/

    
}
