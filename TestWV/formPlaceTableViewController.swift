//
//  formPlaceTableViewController.swift
//  TestWV
//
//  Created by earth on 17/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import GRDB
import NVActivityIndicatorView
import CoreLocation
import Toaster
import SearchTextField
import MapboxGeocoder

class formPlaceTableViewController: UITableViewController, CLLocationManagerDelegate, UINavigationControllerDelegate, UIImagePickerControllerDelegate {

    @IBOutlet weak var addPlacesTF: SearchTextField!
    var items = [SearchTextFieldItem]()
    
    @IBOutlet weak var captureImage: UIButton!
    @IBOutlet weak var selectImageBtn: UIButton!
    
    @IBOutlet weak var searchTV: SearchTextField!
    @IBOutlet weak var topImageView: UIImageView!
    
    @IBOutlet weak var titleTF: UITextField!
    
    @IBOutlet weak var descriptionTV: UITextView!
    
    @IBOutlet weak var locationDescriptionTV: UITextView!
    
    @IBOutlet weak var latitudeTF: UITextField!
    
    @IBOutlet weak var longitudeTF: UITextField!
    
    @IBOutlet weak var getLocationBtn: UIButton!
    
    @IBOutlet weak var websiteTF: UITextField!
    
    @IBOutlet weak var phoneNumberTF: UITextField!
    
    @IBOutlet weak var saveNewPlaceBtn: UIButton!
    
    var imagePicker = UIImagePickerController()
    var site_url = "http://34.231.31.72/xplore/index.php/"
    
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
                    #if !os(tvOS)
                        let formatter = CNPostalAddressFormatter()
                        address = formatter.string(from: (placemark?.postalAddress!)!)
                        print(formatter.string(from: (placemark?.postalAddress!)!))
                        // 200 Queen St
                        // Saint John New Brunswick E2L 2X1
                        // Canada
                    #endif
                    if ((self.items.index(where: { $0.subtitle == address })) != nil) {
                        
                    }else{
                        self.items.append(SearchTextFieldItem(title: (placemark?.name)!, subtitle: address))
                    }
                    
                    //self.items = self.items.uniq ()
                    
                    self.addPlacesTF.filterItems(self.items)
                    self.addPlacesTF.itemSelectionHandler = { filteredResults, itemPosition in
                        // Just in case you need the item position
                        //print(self.items)
                        
                        let item = filteredResults[itemPosition]
                        print("Item at position \(itemPosition): \(item.title)")
                        
                        // Do whatever you want with the picked item
                        self.addPlacesTF.text = item.title
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
                            #if !os(tvOS)
                                let formatter = CNPostalAddressFormatter()
                                address = formatter.string(from: placemark.postalAddress!)
                            #endif
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
        titleTF.text = Name
        let lat = Coordinates["latitude"] as! Double
        let long = Coordinates["longitude"] as! Double
        latitudeTF.text = String(format:"%f", lat)
        longitudeTF.text = String(format:"%f", long)
        locationDescriptionTV.text = Location
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        ToastView.appearance().backgroundColor = .white
        ToastView.appearance().textColor = .black
        ToastView.appearance().font = .boldSystemFont(ofSize: 15)
        ToastView.appearance().bottomOffsetPortrait = 250.0
        
        locManager.delegate = self
        locManager.desiredAccuracy = kCLLocationAccuracyBest
        locManager.requestWhenInUseAuthorization()
        locManager.startMonitoringSignificantLocationChanges()
        //getLocationBtn.layer.cornerRadius = 25

        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: "dismissKeyboard")
        
        //Uncomment the line below if you want the tap not not interfere and cancel other interactions.
        //tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
        
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
            //locationManager.startUpdatingHeading()
        }
        
        
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

    }
    
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
        let lat:String = String(format:"%f", latCenter!)
        let long:String = String(format:"%f", longCenter!)
        
        latitudeTF.text = lat
        longitudeTF.text = long
        
        let geocoder = Geocoder(accessToken: "pk.eyJ1IjoiYXl1c2hnZWhhbG90IiwiYSI6ImNpbDUwbmlhcTQ3dWh2eW0zaXN1cTExZjgifQ.RXW6tJJo4F2MSY-qoDRmFg")
        let options = ReverseGeocodeOptions(coordinate: CLLocationCoordinate2D(latitude: CLLocationDegrees(latCenter!), longitude: CLLocationDegrees(longCenter!)))
        
        let task = geocoder.geocode(options) { (placemarks, attribution, error) in
            guard let placemark = placemarks?.first else {
                return
            }
            self.locationDescriptionTV.text = placemark.qualifiedName
            self.titleTF.text = "Enter Title"
            self.descriptionTV.text = "Enter Description"
            self.websiteTF.text = "Website"
            self.phoneNumberTF.text = "Phone"
            
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation:CLLocation = locations[0] as CLLocation
        
        // Call stopUpdatingLocation() to stop listening for location updates,
        // other wise this function will be called every time when user location changes.
        
        // manager.stopUpdatingLocation()
        
        //print("user latitude = \(userLocation.coordinate.latitude)")
        //print("user longitude = \(userLocation.coordinate.longitude)")
        latCenter = userLocation.coordinate.latitude
        longCenter = userLocation.coordinate.longitude
        
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error)
    {
        print("Error \(error)")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func selectImageClicked(_ sender: UIButton) {
        if UIImagePickerController.isSourceTypeAvailable(.savedPhotosAlbum){
            print("Button capture")
            
            imagePicker.delegate = self as! UIImagePickerControllerDelegate & UINavigationControllerDelegate
            imagePicker.sourceType = .savedPhotosAlbum;
            imagePicker.allowsEditing = false
            
            self.present(imagePicker, animated: true, completion: nil)
        }
    }
    
    //Calls this function when the tap is recognized.
    func dismissKeyboard() {
        //Causes the view (or one of its embedded text fields) to resign the first responder status.
        view.endEditing(true)
    }
    
    @IBAction func captureImageClicked(_ sender: UIButton) {
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            var imagePicker = UIImagePickerController()
            imagePicker.delegate = self
            imagePicker.sourceType = .camera;
            imagePicker.allowsEditing = false
            self.present(imagePicker, animated: true, completion: nil)
        }
    }
    
    func imagePickerController(picker: UIImagePickerController!, didFinishPickingImage image: UIImage!, editingInfo: NSDictionary!){
        
        
        if let image = editingInfo[UIImagePickerControllerOriginalImage] as? UIImage {
            topImageView.image = image
        } else{
            print("Something went wrong")
        }
        
        self.dismiss(animated: true, completion: { () -> Void in
        })
        
        
    }
    
    @IBAction func getLocationClicked(_ sender: UIButton) {
        determineMyCurrentLocation()
    }
    
    @IBAction func removeBtnClicked(_ sender: UIButton) {
    }
    @IBOutlet weak var removeImageBtn: UIButton!
    
    @IBAction func savePlaceClicked(_ sender: UIButton) {
        var site_url2 = ""
        site_url2 = site_url + "places_n/places_save"
        
        let params: Parameters = [
            
            "Address": locationDescriptionTV.text!,
            "Name": titleTF.text as! String,
            "Latitude": latitudeTF.text!,
            "Longitude": longitudeTF.text!,
            "Web": websiteTF.text,
            "Phone": phoneNumberTF.text,
            "Description": descriptionTV.text,
            "imageURI" : ""
        ]
        
        
        
        Alamofire.request(site_url2, method: .post, parameters: params).responseJSON { response in
            switch response.result {
            case .success:
                print(response)
                

                Toast(text: "Place saved successfully").show()
                self.locationDescriptionTV.text! = ""
                self.titleTF.text
                    = ""
                self.latitudeTF.text! = ""
                self.longitudeTF.text! = ""
                self.websiteTF.text = ""
                self.phoneNumberTF.text = ""
                self.descriptionTV.text = ""
                
            case .failure(let error):
                print("Error \(error.localizedDescription)")
                Toast(text: "Something went wrong..!").show()
                print(response)
            }
        }

        
        
    }
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 12
    }

    

}
