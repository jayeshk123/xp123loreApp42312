//
//  placeImageViewController.swift
//  TestWV
//
//  Created by earth on 14/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import Cosmos

class placeImageViewController: UIViewController {
    
    @IBOutlet weak var layerOne: UIView!
    @IBOutlet weak var backgroundLayer: UIView!
    @IBOutlet weak var ratingImage: CosmosView!
    @IBOutlet weak var mainImage: UIImageView!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var cameraLabel: UILabel!
    @IBOutlet weak var ratingLabel: UILabel!
    @IBOutlet weak var distanceLabel: UILabel!
    @IBOutlet weak var ratingDetailsLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var backBtn: UIButton!
    var dbQueue: DatabaseQueue!
    
    let colors = Colors()
    
    func refresh() {
        /*backgroundLayer.backgroundColor = UIColor.clear
        let backLayer = colors.gl
        backLayer?.frame = view.frame
        backgroundLayer.layer.insertSublayer(backLayer!, at: 0)*/
        
        let view = UIView(frame: mainImage.frame)
        
        let gradient = CAGradientLayer()
        
        gradient.frame = view.frame
        
        gradient.colors = [UIColor.clear.cgColor, UIColor.black.cgColor]
        
        gradient.locations = [0.0, 1.0]
        
        view.layer.insertSublayer(gradient, at: 0)
        
        mainImage.addSubview(view)
        
        mainImage.bringSubview(toFront: view)
        
        /*layerOne.backgroundColor = UIColor.clear
        let backLayer1 = colors.gl
        backLayer1?.frame = view.frame
        layerOne.layer.insertSublayer(backLayer1!, at: 0)*/
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let rectShape = CAShapeLayer()
        rectShape.bounds = backBtn.frame
        rectShape.position = backBtn.center
        rectShape.path = UIBezierPath(roundedRect: backBtn.bounds, byRoundingCorners: [.bottomRight , .topRight], cornerRadii: CGSize(width: 20, height: 20)).cgPath
        backBtn.layer.mask = rectShape
        backBtn.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        setUpDatabasePath()
        getPlaceDetails()
        refresh()
        // Do any additional setup after loading the view.
    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
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
    
    public func getPlaceDetails(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                    let sectionIndex: String = row.value(named: "uniqueID")
                    let name: String = row.value(named: "name")
                    let address: String = row.value(named: "address")
                    let distance: String = row.value(named: "distance")
                    let website: String = row.value(named: "website")
                    let lattitude: String = row.value(named: "lattitude")
                    let longitude: String = row.value(named: "longitude")
                    let description: String = row.value(named: "description")
                    var image: String = row.value(named: "image")
                    let phone: String = row.value(named: "phone")
                    let foursquareRating: String = row.value(named: "foursquareRating")
                    let yelpRating: String = row.value(named: "yelpRating")
                    let quality: String = row.value(named: "quality")
                    let totalReviews: String = row.value(named: "totalReviews")
                    let avgRating: String = row.value(named: "avgRating")
                    print(sectionIndex)
                    
                    ratingImage.rating = Double(avgRating)!
                    distanceLabel.text = distance
                    if image != "" && image != nil{
                        if image.contains(","){
                           let imageArray = image.components(separatedBy: ",")
                           image = imageArray[0]
                        }
                        if image.contains(" "){
                            image = image.replacingOccurrences(of: " ", with: "%20")
                        }
                        let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/"+image)! as URL
                        print("Download Started")
                        /*let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                        NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)*/
                        print(imageUrl);
                        getDataFromUrl(url: imageUrl) { (data, response, error)  in
                            guard let data = data, error == nil else { return }
                            print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                            print("Download Finished")
                            /*NVActivityIndicatorPresenter.sharedInstance.stopAnimating()*/
                            DispatchQueue.main.async() { () -> Void in
                                self.mainImage.image = UIImage(data: data)
                                //self.mainImage.contentMode = .scaleAspectFit
                            }
                        }

                    }else{
                        self.mainImage.image = UIImage(named: "default")
                    }
                    
                    
                    
                    titleLabel.text = name
                    ratingDetailsLabel.text = avgRating + " / " + totalReviews + " Reviews"
                    distanceLabel.text = distance
                    ratingLabel.text = "$$$$"
                    //headerStatusLabel.text = ""
                    /*detailsTextView.text = description
                    websiteLabel.text = website
                    phoneNumberLabel.text = phone
                    addressLabel.text = address
                    */
                    
                }
                /*try db.execute(
                    "delete from placeProfile")
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM placeProfile")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT uniqueID FROM placeProfile")
                print("Count : \(elCount)")*/
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    @IBAction func backBtnClicked(_ sender: UIButton) {
        self.dismiss(animated: true, completion: nil)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}

class Colors {
    var gl:CAGradientLayer!
    
    init() {
        let colorTop = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.65).cgColor
        
        let colorBottom = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 1.0).cgColor
        
        /*let colorTop = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.2).cgColor
        
        let colorTwo = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.4).cgColor
        
        let colorThree = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.6).cgColor
        
        let colorFour = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 0.8).cgColor
        let colorBottom = UIColor(red: 0.0 / 255.0, green: 0.0 / 255.0, blue: 0.0 / 255.0, alpha: 1.0).cgColor*/
        
        self.gl = CAGradientLayer()
        self.gl.colors = [colorTop/*, colorTwo, colorThree, colorFour*/, colorBottom]
        self.gl.locations = [0.0, 1.0]
    }
}
