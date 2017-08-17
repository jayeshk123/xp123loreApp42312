//
//  nativeDiscoverInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 25/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import GRDB
import NVActivityIndicatorView
import MapboxGeocoder
import SearchTextField

class nativeDiscoverInnerTableViewController: UITableViewController, NVActivityIndicatorViewable, CLLocationManagerDelegate {
    
    var suggestions = [String]()
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
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
    
    
    func TFDidChange(){
        print("Edit Started")
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        
        if (locationTF.text?.characters.count)! > 0{
            iAmHereLabel.text = locationTF.text
            
            let options = ForwardGeocodeOptions(query: locationTF.text!)
            
            // To refine the search, you can set various properties on the options object.
            //options.allowedISOCountryCodes = ["CA"]
            //options.focalLocation = CLLocation(latitude: 45.3, longitude: -66.1)
            options.allowedScopes = [.address, .pointOfInterest]
            
            let task = geocoder.geocode(options) { (placemarks, attribution, error) in
                if(placemarks != nil){
                    self.suggestions.removeAll()
                    for i in 0..<Int((placemarks?.count)!){
                        guard let placemark = placemarks?[i] else {
                            return
                        }
                        let coordinate = placemark.location.coordinate
                        //print(placemark.name)
                        // 200 Queen St
                        print(placemark.qualifiedName)
                        self.suggestions.append(placemark.qualifiedName)
                    }
                    
                    
                    self.locationTFNew.filterStrings(self.suggestions)
                    // 200 Queen St, Saint John, New Brunswick E2L 2X1, Canada
                    self.locationTF.maxNumberOfResults = 5
                    
                    
                    
                    #if !os(tvOS)
                        let formatter = CNPostalAddressFormatter()
                        //print(formatter.string(from: placemark.postalAddress!))
                        // 200 Queen St
                        // Saint John New Brunswick E2L 2X1
                        // Canada
                    #endif
                }
                
            }

        }else{
            iAmHereLabel.text = "I am here..."
        }
        
                print(suggestions)
    }
    

    @IBAction func getCurrLocationClicked(_ sender: UIButton) {
        print("Current Location :")
        
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        let options = ReverseGeocodeOptions(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)))
        // Or perhaps: ReverseGeocodeOptions(location: locationManager.location)
        
        let task = geocoder.geocode(options) { (placemarks, attribution, error) in
            guard let placemark = placemarks?.first else {
                return
            }
            
            print(placemark.imageName ?? "")
            // telephone
            print(placemark.genres?.joined(separator: ", ") ?? "")
            // computer, electronic
            print(placemark.administrativeRegion?.name ?? "")
            // New York
            print(placemark.administrativeRegion?.code ?? "")
            // US-NY
            print(placemark.place?.wikidataItemIdentifier ?? "")
            // Q60
            print(placemark.qualifiedName)
            self.iAmHereLabel.text = placemark.qualifiedName
        }
    }
    
    @IBOutlet weak var locationTFNew: SearchTextField!
    
    @IBOutlet weak var locationTF: SearchTextField!
    @IBOutlet var clearCategoryBtn: UIButton!
    @IBOutlet var guideBtn: UIButton!
    @IBOutlet var changeLocationBtn: UIButton!
    @IBOutlet var setupDistanceBtn: UIButton!
    @IBOutlet var getLocationBtn: UIButton!
    @IBOutlet var hideDistanceBtn: UIButton!
    @IBOutlet var hideLocationBtn: UIButton!
    
    @IBOutlet var SetupDistanceCell: UITableViewCell!
    @IBOutlet var ChangeLocationCell: UITableViewCell!
    
    @IBOutlet var eatCircleBtn: UIButton!
    @IBOutlet var drinkCircleBtn: UIButton!
    @IBOutlet var listenCircleBtn: UIButton!
    @IBOutlet var watchCircleBtn: UIButton!
    @IBOutlet var doCircleBtn: UIButton!
    @IBOutlet var experienceCircleBtn: UIButton!
    @IBOutlet weak var iAmHereLabel: UILabel!
    
    
    var selectDistanceVisible = false
    var changeLocationVisible = false
    
    var businesses: [Business]!
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
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        SetupDistanceCell.frame.size.height = 0
        clearCategoryBtn.backgroundColor = .clear
        clearCategoryBtn.layer.cornerRadius = 10
        clearCategoryBtn.layer.borderWidth = 1
        clearCategoryBtn.layer.borderColor = UIColor.white.cgColor
        
        guideBtn.backgroundColor = .clear
        guideBtn.layer.cornerRadius = 10
        guideBtn.layer.borderWidth = 1
        guideBtn.layer.borderColor = UIColor.white.cgColor
        
        /*let greyColor = UIColor(red: 70.0/255.0, green: 71.0/255.0, blue: 90.0/255.0, alpha: 1.0) as! CGColor*/
        
        changeLocationBtn.layer.cornerRadius = 10
        changeLocationBtn.layer.borderWidth = 1
        changeLocationBtn.layer.borderColor = UIColor.gray.cgColor
        
        setupDistanceBtn.layer.cornerRadius = 10
        setupDistanceBtn.layer.borderWidth = 1
        setupDistanceBtn.layer.borderColor = UIColor.gray.cgColor
        
        locationTF.addTarget(self, action: "TFDidChange", for: UIControlEvents.editingChanged)
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
        
        /*Business.searchWithTerm(term: "170 w polk", completion: { (businesses: [Business]?, error: Error?) -> Void in
            
            self.businesses = businesses
            if let businesses = businesses {
                for business in businesses {
                    print(business.name!)
                    print(business.address!)
                }
            }
            
        }
        )*/
        
        /* Example of Yelp search with more search options specified
         Business.searchWithTerm("Restaurants", sort: .Distance, categories: ["asianfusion", "burgers"], deals: true) { (businesses: [Business]!, error: NSError!) -> Void in
         self.businesses = businesses
         
         for business in businesses {
         print(business.name!)
         print(business.address!)
         }
         }
         */
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func clearCategoryClicked(_ sender: UIButton) {
        let refreshAlert = UIAlertController(title: "Clear Selected Categories", message: "All selections will be lost.", preferredStyle: UIAlertControllerStyle.alert)
        
        refreshAlert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action: UIAlertAction!) in
            do {
                //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
                //let dbQueue = try DatabaseQueue(path: databasePath)
                
                try self.dbQueue.inDatabase { db in
                    try db.execute(
                        "DELETE FROM doList")
                    
                    try db.execute(
                        "DELETE FROM watchList")
                    
                    try db.execute(
                        "DELETE FROM listenList")
                    
                    try db.execute(
                        "DELETE FROM eatList")
                    
                    try db.execute(
                        "DELETE FROM drinkList")
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
    
    @IBAction func eatClicked(_ sender: UIButton) {
        
        /*let bounds = eatCircleBtn.bounds
        UIView.animate(withDuration: 1.0, delay: 0.0, usingSpringWithDamping: 0.2, initialSpringVelocity: 10, options:[], animations: {
            self.eatCircleBtn.bounds = CGRect(x: bounds.origin.x - 20, y: bounds.origin.y, width: bounds.size.width + 60, height: bounds.size.height)
        }, completion: nil)*/
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let when = DispatchTime.now() + 0.5 // change 2 to desired number of seconds
        DispatchQueue.main.asyncAfter(deadline: when) {
            // Your code with delay
            
            let controller = self.storyboard!.instantiateViewController(withIdentifier: "eatList")
            self.addChildViewController(controller)
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            
            NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            
            controller.didMove(toParentViewController: self)
        }
        
        
        //self.parent?.removeFromParentViewController()

    }
    
    @IBAction func drinkClicked(_ sender: UIButton) {
        
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let when = DispatchTime.now() + 0.5 // change 2 to desired number of seconds
        DispatchQueue.main.asyncAfter(deadline: when) {
            // Your code with delay
            
            let controller = self.storyboard!.instantiateViewController(withIdentifier: "drinkList")
            self.addChildViewController(controller)
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            
            NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            
            controller.didMove(toParentViewController: self)
        }
    }
    
    @IBAction func listenClicked(_ sender: UIButton) {
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let when = DispatchTime.now() + 0.5 // change 2 to desired number of seconds
        DispatchQueue.main.asyncAfter(deadline: when) {
            // Your code with delay
            
            let controller = self.storyboard!.instantiateViewController(withIdentifier: "listenList")
            self.addChildViewController(controller)
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            
            NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            
            controller.didMove(toParentViewController: self)
        }
    }
    
    @IBAction func watchClicked(_ sender: UIButton) {
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let when = DispatchTime.now() + 0.5 // change 2 to desired number of seconds
        DispatchQueue.main.asyncAfter(deadline: when) {
            // Your code with delay
            
            let controller = self.storyboard!.instantiateViewController(withIdentifier: "watchList")
            self.addChildViewController(controller)
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            
            NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            
            controller.didMove(toParentViewController: self)
        }
    }
    
    @IBAction func doClicked(_ sender: UIButton) {
        let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
        let when = DispatchTime.now() + 0.5 // change 2 to desired number of seconds
        DispatchQueue.main.asyncAfter(deadline: when) {
            // Your code with delay
            
            let controller = self.storyboard!.instantiateViewController(withIdentifier: "doList")
            self.addChildViewController(controller)
            controller.view.frame = self.view.frame
            self.view.addSubview(controller.view)
            
            NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            
            controller.didMove(toParentViewController: self)
        }
    }
    
    @IBAction func expClicked(_ sender: UIButton) {
        
    }
    
    
    @IBAction func closeChangeLocationClicked(_ sender: UIButton) {
        changeLocationVisible = false
        selectDistanceVisible = false
        setupDistanceBtn.backgroundColor = .clear
        changeLocationBtn.backgroundColor = .clear
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }

    @IBAction func closeSetupDistanceClicked(_ sender: UIButton) {
        changeLocationVisible = false
        selectDistanceVisible = false
        setupDistanceBtn.backgroundColor = .clear
        changeLocationBtn.backgroundColor = .clear
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    @IBAction func btnChangeLocationClicked(_ sender: UIButton) {
        setupDistanceBtn.backgroundColor = .clear
        
        setupDistanceBtn.backgroundColor = UIColor.black
        setupDistanceBtn.layer.borderWidth = 2
        setupDistanceBtn.layer.borderColor = UIColor(red:0.27, green:0.28, blue:0.35, alpha:1).cgColor
        
        changeLocationBtn.backgroundColor = UIColor.red
        ChangeLocationCell.frame.size.height = 64
        changeLocationVisible = true
        selectDistanceVisible = false
        //tableView.reloadData()
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    @IBAction func btnSetupDistanceClicked(_ sender: UIButton) {
        changeLocationBtn.backgroundColor = .clear
        setupDistanceBtn.backgroundColor = UIColor.red
        SetupDistanceCell.frame.size.height = 64
        changeLocationVisible = false
        selectDistanceVisible = true
        //tableView.reloadData()
        UIView.transition(with: tableView, duration: 0.35, options: .transitionCrossDissolve, animations: {self.tableView.reloadData()}, completion: nil)
    }
    
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 5
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.row == 1 {
            selectDistanceVisible = !selectDistanceVisible
            tableView.reloadData()
        }
        tableView.deselectRow(at: indexPath, animated: false)
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.row >= 0 && indexPath.row < 6 {
            if indexPath.row == 0 {
                return 63.0
            }
            if indexPath.row == 1 && changeLocationVisible == false {
                return 0.0
            }
            if indexPath.row == 1 && changeLocationVisible == true {
                return 94.0
            }
            if indexPath.row == 2 && selectDistanceVisible == false{
                return 0.0
            }
            if indexPath.row == 2 && selectDistanceVisible == true{
                return 94.0
            }
            if indexPath.row == 3 {
                return 260.0
            }
            if indexPath.row == 4 {
                return 84.0
            }
        }else{
            return 0.0
        }
        return 260
    }

    
   /* override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "TopBtnCell", for: indexPath)

        // Configure the cell...
        
        return cell
    }*/
    

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
