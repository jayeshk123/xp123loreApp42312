//
//  nativeListTableViewController.swift
//  TestWV
//
//  Created by earth on 04/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import GRDB
import NVActivityIndicatorView
import MapboxGeocoder
import SearchTextField
import RZTransitions

class nativeListTableViewController: UITableViewController, NVActivityIndicatorViewable, CLLocationManagerDelegate {
    
    @IBAction func eventsClicked(_ sender: Any) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "EventsList")
        newViewController.transitioningDelegate = RZTransitionsManager.shared()
        
        self.present(newViewController, animated: true, completion: nil)
    }
    
    @IBAction func newsClicked(_ sender: Any) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "NewsList")
        newViewController.transitioningDelegate = RZTransitionsManager.shared()
        
        self.present(newViewController, animated: true, completion: nil)
    }
    
    @IBAction func dealsClicked(_ sender: Any) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "PromosList")
        newViewController.transitioningDelegate = RZTransitionsManager.shared()
        
        self.present(newViewController, animated: true, completion: nil)
    }
    
    @IBAction func discoverClicked(_ sender: Any) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeDiscoverController")
        newViewController.transitioningDelegate = RZTransitionsManager.shared()
        
        self.present(newViewController, animated: true, completion: nil)
    }

    var selectDistanceVisible = false
    var changeLocationVisible = false
    
    @IBOutlet weak var setupDistanceBtn: UIButton!
    @IBOutlet weak var changeLocationBtn: UIButton!
    @IBOutlet weak var iAmHereLabel: UILabel!
    @IBOutlet weak var ChangeLocationCell: UITableViewCell!
    @IBOutlet weak var SetupDistanceCell: UITableViewCell!
    @IBOutlet weak var locationTFNew: SearchTextField!
    
    @IBOutlet weak var sliderValLabel: UILabel!
    
    @IBOutlet weak var locationTF: SearchTextField!
    var suggestions = [String]()
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    
    @IBOutlet weak var silderView: UISlider!
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
    @IBAction func sliderValChanged(_ sender: UISlider) {
        let sliderVal = NSString(format: "%.2f mi", sender.value)
        sliderValLabel.text = sliderVal as String
        
        
    }
    
    
    
    @IBAction func sliderValChangeComplete(_ sender: Any) {
        print("Complete")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        
        
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
        
        changeLocationBtn.layer.cornerRadius = 20
        changeLocationBtn.layer.borderWidth = 1
        changeLocationBtn.layer.borderColor = UIColor.gray.cgColor
        
        setupDistanceBtn.layer.cornerRadius = 20
        setupDistanceBtn.layer.borderWidth = 1
        setupDistanceBtn.layer.borderColor = UIColor.gray.cgColor
        
        locationTF.addTarget(self, action: "TFDidChange", for: UIControlEvents.editingChanged)
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        
        SetupDistanceCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        ChangeLocationCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
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
                    self.locationTF.itemSelectionHandler = { filteredResults, itemPosition in
                        // Just in case you need the item position
                        //print(self.items)
                        
                        let item = filteredResults[itemPosition]
                        print("Item at position \(itemPosition): \(item.title)")
                        self.locationTF.text = item.title.uppercased()
                        self.iAmHereLabel.text = item.title.uppercased()
                        GlobalLocation.location = item.title.uppercased()
                    }
                    
                    
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
        
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        defaultLocation()
        manager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
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
        return 6
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if indexPath.row >= 0 && indexPath.row < 6 {
            if indexPath.row == 0 {
                return 55.0
            }
            if indexPath.row == 1 {
                return 59.0
            }
            if indexPath.row == 2 && changeLocationVisible == false {
                return 0.0
            }
            if indexPath.row == 2 && changeLocationVisible == true {
                return 94.0
            }
            if indexPath.row == 3 && selectDistanceVisible == false{
                return 0.0
            }
            if indexPath.row == 3 && selectDistanceVisible == true{
                return 94.0
            }
            if indexPath.row == 4 {
                return 430.0
            }
            if indexPath.row == 5 {
                return 60.0
            }
        }else{
            return 0.0
        }
        return 430.0
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
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.row == 1 {
            selectDistanceVisible = !selectDistanceVisible
            tableView.reloadData()
        }
        tableView.deselectRow(at: indexPath, animated: false)
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
