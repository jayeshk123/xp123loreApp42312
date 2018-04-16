//
//  experienceInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 03/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import SearchTextField
import NVActivityIndicatorView
import MapboxGeocoder
import CoreLocation
import Toaster
import PopupDialog
import Alamofire
import SwiftyJSON

class experienceInnerTableViewController: UITableViewController, CLLocationManagerDelegate {

    
    var suggestions = [String]()
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    var URL = "http://34.231.31.72/xplore/index.php"
    @IBOutlet weak var iAmHereLabel: UILabel!
    @IBOutlet weak var getCurrLocBtn: UIButton!
    @IBOutlet weak var changeLocBtn: UIButton!
    @IBOutlet weak var changeLocTF: UITextField!
    @IBOutlet weak var addPlacesTF: SearchTextField!
    var businesses: [Business]!
    
    @IBOutlet weak var clearBtn: UIButton!
    @IBOutlet weak var showVisitedBtn: UIButton!
    @IBOutlet weak var optimizeRoute: UIButton!
    
    var addresses = [String]()
    var items = [SearchTextFieldItem]()
    var dbQueue: DatabaseQueue!
    var showHiddenLocCell:Bool = false
    
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
    
    @IBAction func clearClicked(_ sender: UIButton) {
        let refreshAlert = UIAlertController(title: "Clear Selected Places", message: "All selections will be lost.", preferredStyle: UIAlertControllerStyle.alert)
        
        refreshAlert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action: UIAlertAction!) in
            do {
                //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
                //let dbQueue = try DatabaseQueue(path: databasePath)
                
                try self.dbQueue.inDatabase { db in
                    /*try db.execute(
                        "DELETE FROM doList")
                    
                    try db.execute(
                        "DELETE FROM watchList")
                    
                    try db.execute(
                        "DELETE FROM listenList")
                    
                    try db.execute(
                        "DELETE FROM eatList")
                    
                    try db.execute(
                        "DELETE FROM drinkList")
                    */
                    try db.execute(
                        "DELETE FROM experience")
                    
                    try db.execute(
                        "DELETE FROM placeProfile")
                    
                    try db.execute(
                        "DELETE FROM selectList")
                    
                    try db.execute(
                        "DELETE FROM selectedPlaces")
                    
                    let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                    NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                    self.present(newViewController, animated: true, completion: nil)
                }
            } catch {
                print(error.localizedDescription)
            }
        }))
        
        refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action: UIAlertAction!) in
            print("Handle Cancel Logic here")
        }))
        
        present(refreshAlert, animated: true, completion: nil)
    }
    
    @IBAction func showVisitedClicked(_ sender: UIButton) {
        do{
            
            
            var sec = [String]()
            sec.removeAll()
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM showSelected where id = 1")
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "isSelected")
                    sec.append(sectionName)
                }
            }
            print("count \(sec.count)")
            print(sec)
            if sec.count > 0{
                if sec[0] == "1" {
                    //show visited
                    try dbQueue.inDatabase { db in
                        try db.execute(
                            "update showSelected set isSelected = '0' ")
                        
                        self.showVisitedBtn.titleLabel?.text = "Show Not Visited"
                        
                        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                        let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                        self.present(newViewController, animated: true, completion: nil)
                    }
                }else{
                    //show not visited
                    try dbQueue.inDatabase { db in
                        try db.execute(
                            "update showSelected set isSelected = '1' ")
                        self.showVisitedBtn.titleLabel?.text = "Show Visited"
                        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                        let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                        self.present(newViewController, animated: true, completion: nil)
                    }
                }
            }else{
                try dbQueue.inDatabase { db in
                    try db.execute(
                        "update showSelected set isSelected = '1' ")
                    self.showVisitedBtn.titleLabel?.text = "Show Visited"
                    let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                    NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                    self.present(newViewController, animated: true, completion: nil)
                }
            }

        }catch{
            print(error.localizedDescription)
        }
    }
    
    @IBAction func optimizedRouteClicked(_ sender: UIButton) {
        // Prepare the popup assets
        let title = "MODE OF TRANSPORT"
        let message = "Please select mode of transport to optimize route of travel"
        
        // Create the dialog
        let popup = PopupDialog(title: title, message: message)
        
        // Create buttons
        let buttonOne = CancelButton(title: "CANCEL") {
            print("You canceled the car dialog.")
        }
        
        let buttonTwo = DefaultButton(title: "CAR") {
            print("What a beauty!")
            self.drivingOptRt()
            //Call for Driving
        }
        
        let buttonThree = DefaultButton(title: "WALKING", height: 60) {
            print("Ah, maybe next time :)")
            self.walkingOptRt()
        }
        
        let buttonFour = DefaultButton(title: "CYCLE", height: 60) {
            print("Ah, maybe next time :)")
            self.cyclingOptRt()
        }
        
        // Add buttons to dialog
        // Alternatively, you can use popup.addButton(buttonOne)
        // to add a single button
        popup.addButtons([buttonOne, buttonTwo, buttonThree, buttonFour])
        
        // Present dialog
        self.present(popup, animated: true, completion: nil)
    }
    
    func drivingOptRt(){
        getWaypoints(mode: 1)
    }
    
    func walkingOptRt(){
        getWaypoints(mode: 2)
    }
    
    func cyclingOptRt(){
        getWaypoints(mode: 3)
    }
    
    var lats:[Float] = []
    var longs:[Float] = []
    public func getWaypoints(mode:Int){
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
            
            let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
            NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
            var newURL = ""
            var coords = ""
            
            for j in 0..<lats.count{
                if j == (lats.count - 1){
                    coords = coords + String(format:"%f", lats[j]) + "," + String(format:"%f", longs[j])
                }else{
                    coords = coords + String(format:"%f", lats[j]) + "," + String(format:"%f", longs[j]) + ";"
                }
            }
            
            let access_token = "&access_token=pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg"
            var modeStr = ""
            if(mode == 1){
                modeStr = "driving"
            }else if(mode == 2){
                modeStr = "walking"
            }else{
                modeStr = "cycling"
            }
            //&source= &destination= value of source and destinations should be first / last / any
            var source:String = ""//String(format:"%.5f", latCenter!) + "," + String(format:"%.5f", longCenter!)
            
            
            let optURL = "https://api.mapbox.com/optimized-trips/v1/mapbox/"
            newURL = modeStr + "/" + coords + "?roundtrip=trues&source=first" + source + access_token
            
            Alamofire.request(optURL + newURL).responseString { response in
                print("Request: \(String(describing: response.request))")   // original url request
                print("Response: \(String(describing: response.response))") // http url response
                print("Result: \(response.result)")
                // response serialization result
                
                if let json = response.data {
                    let data = JSON(data: json)
                    print(data)
                    
                    NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                    
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "placeProfile")
                    self.present(newViewController, animated: true, completion: nil)
                }
                
            }
        }catch {
            print(error.localizedDescription)
        }
        
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        defaultLocation()
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }
    
    func defaultLocation(){
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        let options = ReverseGeocodeOptions(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)))
        // Or perhaps: ReverseGeocodeOptions(location: locationManager.location)
        
        let task = geocoder.geocode(options) { (placemarks, attribution, error) in
            guard let placemark = placemarks?.first else {
                return
            }
            if(GlobalLocation.location == ""){
                GlobalLocation.location = placemark.qualifiedName.uppercased()
            }
            self.iAmHereLabel.text = GlobalLocation.location.uppercased()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
        var buttonAppearance = DefaultButton.appearance()
        
        // Default button
        buttonAppearance.titleFont      = UIFont.systemFont(ofSize: 14)
        buttonAppearance.titleColor     = UIColor(red: 0.25, green: 0.53, blue: 0.91, alpha: 1)
        buttonAppearance.buttonColor    = UIColor.clear
        buttonAppearance.separatorColor = UIColor(white: 0.9, alpha: 1)
        
        // Below, only the differences are highlighted
        
        // Cancel button
        CancelButton.appearance().titleColor = UIColor.lightGray
        
        // Destructive button
        DestructiveButton.appearance().titleColor = UIColor.red
        
        ToastView.appearance().backgroundColor = .white
        ToastView.appearance().textColor = .black
        ToastView.appearance().font = .boldSystemFont(ofSize: 15)
        ToastView.appearance().bottomOffsetPortrait = 500.0
        addPlacesTF.attributedPlaceholder = NSAttributedString(string: "ADD MORE PLACES BY NAME HERE",
                                                               attributes: [NSForegroundColorAttributeName: UIColor.lightGray])
        
        changeLocBtn.layer.cornerRadius = 10
        changeLocBtn.layer.borderWidth = 1
        changeLocBtn.layer.borderColor = UIColor.gray.cgColor
        
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        addPlacesTF.borderStyle = .roundedRect
        addPlacesTF.leftView?.contentMode = .scaleAspectFit
        
        let iconWidth = 25;
        let iconHeight = 25;
        let imageView = UIImageView();
        let search = UIImage(named: "search");
        imageView.image = search;
        imageView.frame = CGRect(x: 7, y:7, width: iconWidth, height: iconHeight)
        
        addPlacesTF.leftViewMode = UITextFieldViewMode.always
        addPlacesTF.addSubview(imageView)        /*let search = UIImageView(image: UIImage(named: "search"))
        if let size = search.image?.size {
            search.frame = CGRect(x: 0.0, y: 0.0, width: size.width , height: size.height)
        }*/
        let paddingView = UIView(frame: CGRect(x:0, y:0, width:25, height:self.addPlacesTF.frame.height))
        
        addPlacesTF.leftView = paddingView
        addPlacesTF.addTarget(self, action: "TFDidChange", for: UIControlEvents.editingChanged)
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }

        var sec = [String]()
        do{
            try dbQueue.inDatabase { db in
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM showSelected where id = 1")
                
                while let row = try rows.next() {
                    let sectionName: String = row.value(named: "isSelected")
                    sec.append(sectionName)
                }
            }
            print("count \(sec.count)")
            print(sec)
            if sec.count > 0{
                if sec[0] == "1" {
                    self.showVisitedBtn.titleLabel?.text = "Show Not Visited"
                }else{
                    self.showVisitedBtn.titleLabel?.text = "Show Visited"
                }
            }else{
                self.showVisitedBtn.titleLabel?.text = "Show Visited"
            }

        }catch{
            print(error.localizedDescription)
        }
    }
    
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
    
    /*func hideKeyboard() {
        tableView.endEditing(true)
    }*/
    
    
    
    
    func TFDidChange(){
        
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        self.items.removeAll()
        addPlacesTF.maxResultsListHeight = 180

        if(addPlacesTF.text == "" || addPlacesTF.text == nil){
            print("DATA is :")
            print(addPlacesTF.text as Any)
        }else{
            let options = ForwardGeocodeOptions(query: addPlacesTF.text!)
            options.focalLocation = CLLocation(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!))
            options.allowedScopes = [.address, .pointOfInterest]
            
            let task = geocoder.geocode(options) { (placemarks, attribution, error) in
                
                print(placemarks)
                print(placemarks?.count)
                if(placemarks == nil){
                    
                }else{
                    let count = Int((placemarks?.count)!)
                    for i in 0..<count{
                        let placemark = placemarks?[i]
                        print(placemark?.name)
                        // 200 Queen St
                        print(placemark?.qualifiedName)
                        // 200 Queen St, Saint John, New Brunswick E2L 2X1, Canada
                        let coordinate = placemark?.location.coordinate
                        print("\(coordinate?.latitude), \(coordinate?.longitude)")
                        // 45.270093, -66.050985
                        var address = "Address not available"
                        if #available(iOS 10.3, *) {
                            #if !os(tvOS)
                                //let formatter = CNPostalAddressFormatter()
                                //address = formatter.string(from: (placemark?.postalAddress!)!).trimmingCharacters(in: CharacterSet.newlines)
                                
                                //print(placemark?.postalAddress?.street)
                                if(placemark?.postalAddress?.street != nil && placemark?.postalAddress?.street != ""){
                                    address = (placemark?.postalAddress?.street)! + ", "
                                }else if(placemark?.qualifiedName != nil && placemark?.qualifiedName != ""){
                                    address = (placemark?.qualifiedName)! + ", "
                                }else{
                                    address = ""
                                }
                                if(placemark?.postalAddress?.subLocality != nil && placemark?.postalAddress?.subLocality != ""){
                                    address = address + (placemark?.postalAddress?.subLocality)! + ", "
                                }
                                if(placemark?.postalAddress?.city != nil && placemark?.postalAddress?.city != ""){
                                    address = address + (placemark?.postalAddress?.city)! + ", "
                                }
                                if(placemark?.postalAddress?.state != nil && placemark?.postalAddress?.state != ""){
                                    address = address + (placemark?.postalAddress?.state)! + ", "
                                }
                                if(placemark?.postalAddress?.country != nil && placemark?.postalAddress?.country != ""){
                                    address = address + (placemark?.postalAddress?.country)! + ", "
                                }
                                if(placemark?.postalAddress?.postalCode != nil && placemark?.postalAddress?.postalCode != ""){
                                    address = address + (placemark?.postalAddress?.postalCode)! + ", "
                                }
                                
                                print(address)
                                // 200 Queen St
                                // Saint John New Brunswick E2L 2X1
                                // Canada
                            #endif
                        } else {
                            // Fallback on earlier versions
                        }
                        if ((self.items.index(where: { $0.subtitle == address })) != nil) {
                            
                        }else{
                            self.items.append(SearchTextFieldItem(title: (placemark?.name.uppercased())!, subtitle: address.uppercased()))
                        }
                        //self.items = self.items.uniq ()
                        self.addPlacesTF.filterItems(self.items)
                        self.addPlacesTF.itemSelectionHandler = { filteredResults, itemPosition in
                            
                            let item = filteredResults[itemPosition]
                            print("Item at position \(itemPosition): \(item.title)")
                            self.addPlacesTF.text = item.title.uppercased()
                            let options = ForwardGeocodeOptions(query: item.title)
                            options.focalLocation = CLLocation(latitude: CLLocationDegrees(self.latCenter!), longitude: CLLocationDegrees(self.longCenter!))
                            options.allowedScopes = [.address, .pointOfInterest]
                            let task = geocoder.geocode(options) { (placemarks, attribution, error) in
                                guard let placemark = placemarks?.first else {
                                    return
                                }
                                //print(placemark)
                                let coordinate = placemark.location.coordinate
                                var address = "Address not available"
                                if #available(iOS 10.3, *) {
                                    #if !os(tvOS)
                                        let formatter = CNPostalAddressFormatter()
                                        //address = formatter.string(from: placemark.postalAddress!)
                                        //address = address.trimmingCharacters(in: CharacterSet.newlines)
                                        
                                        address = (placemark.postalAddress?.street)! + ", "
                                        if(placemark.postalAddress?.subLocality != nil && placemark.postalAddress?.subLocality != ""){
                                            address = address + (placemark.postalAddress?.subLocality)! + ", "
                                        }
                                        if(placemark.postalAddress?.city != nil && placemark.postalAddress?.city != ""){
                                            address = address + (placemark.postalAddress?.city)! + ", "
                                        }
                                        if(placemark.postalAddress?.state != nil && placemark.postalAddress?.state != ""){
                                            address = address + (placemark.postalAddress?.state)! + ", "
                                        }
                                        if(placemark.postalAddress?.country != nil && placemark.postalAddress?.country != ""){
                                            address = address + (placemark.postalAddress?.country)! + ", "
                                        }
                                        if(placemark.postalAddress?.postalCode != nil && placemark.postalAddress?.postalCode != ""){
                                            address = address + (placemark.postalAddress?.postalCode)! + ", "
                                        }
                                        
                                        print(address)
                                    #endif
                                } else {
                                    // Fallback on earlier versions
                                }
                                var placename = ""
                                if((placemark.name) != nil){
                                    placename = placemark.name
                                    if placename == nil || placename == ""{
                                        placename = ""
                                    }
                                }else{
                                    placename = ""
                                }
                                print(placename)
                                if address == nil || address == ""{
                                    address = ""
                                }
                                print(address)
                                print(coordinate)
                                var imagename = ""
                                if((placemark.imageName) != nil){
                                    imagename = placemark.imageName!
                                    if imagename == nil || imagename == ""{
                                        imagename = ""
                                    }
                                }else{
                                    imagename = ""
                                }
                                
                                print(imagename)
                                let random = String(arc4random())
                                
                                //print(placemark.code!)
                                var dict = ["latitude": coordinate.latitude, "longitude": coordinate.longitude] as [AnyHashable : CLLocationDegrees]
                                let nsDict = dict as! NSDictionary
                                self.addToDB(Name: placename, Location: address, Coordinates: nsDict, image: imagename, id: random)
                            }
                        }
                        
                    }
                }
                
                
                guard let placemark = placemarks?.first else {
                    return
                }
                
            }
        }
        
        
        self.addPlacesTF.theme.bgColor = UIColor (red: 0.9, green: 0.9, blue: 0.9, alpha: 1)
        self.addPlacesTF.theme.cellHeight = 40.0
        self.addPlacesTF.theme.font = UIFont(name: "Times New Roman", size: 15)!
        
        
        
        
        print("Edit Started")
        
    }
    
    public func addToDB(Name:String, Location:String, Coordinates:NSDictionary, image:String, id:String){
        do {
            print("TEST \(Coordinates)")
            let lat = Coordinates["latitude"] as! Double
            let long = Coordinates["longitude"] as! Double

            
            
            try dbQueue.inDatabase { db in
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience where location = ?",arguments:[Location])!
                
                if elCount > 0{
                    Toast(text: "The place you are trying to add is already present...").show()
                }else{
                    try db.execute(
                        "INSERT INTO experience (uniqueId, name, location, distance, status, lattitude, longitude, description, image, selected, visited, position) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        arguments: [id, Name, Location, "1 mi away", "OPEN", lat,long,"Test Desc",image,"0","0","0"])
                    
                    
                    let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                    NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                    let newViewController = storyBoard.instantiateViewController(withIdentifier: "experienceTableTableViewController")
                    self.present(newViewController, animated: true, completion: nil)
                    print("TEST")
                }
                
                
            }
        } catch {
            print(error.localizedDescription)
        }
    }
    
    

    
    @IBAction func changeLocationClicked(_ sender: UIButton) {
        print("Change Location Clicked")
        if showHiddenLocCell == false{
            showHiddenLocCell = true
        }else{
            showHiddenLocCell = false
        }
        tableView.reloadData()
    }
    
    @IBAction func getCurrLocClicked(_ sender: UIButton) {
        print("Get Current Location Clicked")
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
        return 4
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.row >= 0 && indexPath.row <= 3 {
            if indexPath.row == 0 {
                return 79.0
            }
            if indexPath.row == 1 && showHiddenLocCell == true {
                return 126.0
            }
            if indexPath.row == 1 && showHiddenLocCell == false {
                return 0.0
            }
            if indexPath.row == 2 {
                return 140.0
            }
            if indexPath.row == 3 {
                return 300.0
            }
        }else{
            return 0.0
        }
        return 200
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

extension Array where Element: Equatable {
    
    public func uniq() -> [Element] {
        var arrayCopy = self
        arrayCopy.uniqInPlace()
        return arrayCopy
    }
    
    mutating public func uniqInPlace() {
        var seen = [Element]()
        var index = 0
        for element in self {
            if seen.contains(element) {
                remove(at: index)
            } else {
                seen.append(element)
                index += 1
            }
        }
    }
}


/*Business.searchWithTerm(term: addPlacesTF.text!, completion: { (businesses: [Business]?, error: Error?) -> Void in
 self.suggestions.removeAll()
 self.businesses = businesses
 self.items.removeAll()
 if let businesses = businesses {
 for business in businesses {
 print(business.name!)
 print(business.address!)
 self.suggestions.append(business.name!)
 self.addresses.append(business.address!)
 self.items.append(SearchTextFieldItem(title: business.name!, subtitle: business.address!))
 self.addPlacesTF.filterItems(self.items)
 self.addPlacesTF.theme.bgColor = UIColor (red: 0.9, green: 0.9, blue: 0.9, alpha: 1)
 
 self.addPlacesTF.itemSelectionHandler = { filteredResults, itemPosition in
 // Just in case you need the item position
 //print(self.items)
 
 let item = filteredResults[itemPosition]
 print("Item at position \(itemPosition): \(item.title)")
 
 // Do whatever you want with the picked item
 self.addPlacesTF.text = item.title
 Business.searchWithTerm(term: item.title, completion: { (businesses: [Business]?, error: Error?) -> Void in
 if let businesses = businesses {
 for business in businesses {
 print(business.name!)
 print(business.address!)
 print(business.locationArr?["coordinate"] as Any)
 let coords = business.locationArr?["coordinate"] as Any
 print(business.id)
 self.addToDB(Name: business.name!, Location: business.address!, Coordinates: coords as! NSDictionary, image: String(describing: business.imageURL), id: business.id!)
 break
 }
 }
 }
 )
 }
 
 self.addPlacesTF.userStoppedTypingHandler = {
 if let criteria = self.addPlacesTF.text {
 if criteria.characters.count > 1 {
 // Show the loading indicator
 self.addPlacesTF.showLoadingIndicator()
 }
 }
 }
 // 200 Queen St, Saint John, New Brunswick E2L 2X1, Canada
 self.addPlacesTF.maxNumberOfResults = 5
 }
 }
 
 }
 )*/

// print(suggestions)
