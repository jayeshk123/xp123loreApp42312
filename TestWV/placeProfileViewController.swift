//
//  placeProfileViewController.swift
//  TestWV
//
//  Created by earth on 17/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import Mapbox
import GRDB
import NVActivityIndicatorView
import MapboxDirections
import MapboxNavigation
import UICircularProgressRing


class placeProfileViewController: UITableViewController {

    @IBOutlet weak var mainImage: UIImageView!
    
    @IBOutlet weak var headTitleLabel: UILabel!
    
    @IBOutlet weak var ratingImage: UIImageView!
    
    @IBOutlet weak var ratingCountLabel: UILabel!
    
    @IBOutlet weak var distanceLabel: UILabel!
    
    @IBOutlet weak var qualityLabel: UILabel!
    
    @IBOutlet weak var headerStatusLabel: UILabel!
    
    @IBOutlet weak var backBtn: UIButton!
    
    @IBOutlet weak var foursquareView: UICircularProgressRingView!
    
    @IBOutlet weak var yelpView: UICircularProgressRingView!
    
    @IBOutlet weak var detailsTextView: UITextView!
    
  /*  @IBOutlet weak var mapBoxView: UIView!
    
    @IBOutlet weak var addressLabel: UILabel!
    
    @IBOutlet weak var phoneNumberLabel: UILabel!
    
    @IBOutlet weak var websiteLabel: UILabel!
    
    @IBOutlet weak var durationLabel: UILabel!
    
    @IBOutlet weak var footerStatusLabel: UILabel!
    
    @IBOutlet weak var imageCell: UITableViewCell!
    @IBOutlet weak var ratingCell: UITableViewCell!
    @IBOutlet weak var separatorCell: UITableViewCell!
    @IBOutlet weak var descCell: UITableViewCell!
    @IBOutlet weak var mapCell: UITableViewCell!
    @IBOutlet weak var infoCell: UITableViewCell!
    @IBOutlet weak var topCell: UITableViewCell!
    @IBOutlet weak var ratinView: UIView!
    @IBOutlet weak var infoView: UIView!*/
    var dbQueue: DatabaseQueue!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        
        
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
        
        setUpDatabasePath()
        getPlaceDetails()
        renderLayout()
        
        // Do any additional setup after loading the view.
    }
    
    public func getPlaceDetails(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                   /* let sectionIndex: String = row.value(named: "uniqueID")
                    let name: String = row.value(named: "name")
                    let address: String = row.value(named: "address")
                    let distance: String = row.value(named: "distance")
                    let website: String = row.value(named: "website")
                    let lattitude: String = row.value(named: "lattitude")
                    let longitude: String = row.value(named: "longitude")*/
                    let description: String = row.value(named: "description")
                    /*do {

                        let attrStr = try NSAttributedString(
                            data: description.data(using: String.Encoding.unicode, allowLossyConversion: true)!,
                            options: [ NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType, NSFontAttributeName: UIFont(name: "System", size: 15.0) ],
                            documentAttributes: nil)
                        detailsTextView.attributedText = attrStr
                    } catch let error {
                        print(error.localizedDescription)
                        detailsTextView.text = description
                    }*/
                    let str = description.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression, range: nil)
                    print(str)
                    
                    detailsTextView.text = str
                    
                    /*let image: String = row.value(named: "image")
                    let phone: String = row.value(named: "phone")
                    let foursquareRating: String = row.value(named: "foursquareRating")
                    let yelpRating: String = row.value(named: "yelpRating")
                    let quality: String = row.value(named: "quality")
                    let totalReviews: String = row.value(named: "totalReviews")
                    let avgRating: String = row.value(named: "avgRating")
                    print(sectionIndex)
                    
                    
                    let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/"+image)! as URL
                    print("Download Started")
                    print(imageUrl);
                    getDataFromUrl(url: imageUrl) { (data, response, error)  in
                        guard let data = data, error == nil else { return }
                        print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                        print("Download Finished")
                        DispatchQueue.main.async() { () -> Void in
                            self.mainImage.image = UIImage(data: data)
                            //self.mainImage.contentMode = .scaleAspectFit
                        }
                    }
                    
                    headTitleLabel.text = name
                    ratingCountLabel.text = avgRating + " / " + totalReviews
                    distanceLabel.text = distance
                    qualityLabel.text = "$$$$"
                    //headerStatusLabel.text = ""*/
                    
                    /*websiteLabel.text = website
                    phoneNumberLabel.text = phone
                    addressLabel.text = address*/
                    
                    
                    

                }/*
                try db.execute(
                    "delete from placeProfile")
                let elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM placeProfile")! // Int
                let elSectionNames = try String.fetchAll(db, "SELECT uniqueID FROM placeProfile")
                print("Count : \(elCount)")*/
            }
        } catch {
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
    
    @IBAction func backBtnClicked(_ sender: UIButton) {
        print("Back clicked")
        self.dismiss(animated: true, completion: nil)

    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }
    
    public func renderLayout(){
        let fixedWidth = detailsTextView.frame.size.width
        detailsTextView.sizeThatFits(CGSize(width: fixedWidth, height: CGFloat.greatestFiniteMagnitude))
        let newSize = detailsTextView.sizeThatFits(CGSize(width: fixedWidth, height: CGFloat.greatestFiniteMagnitude))
        var newFrame = detailsTextView.frame
        newFrame.size = CGSize(width: max(newSize.width, fixedWidth), height: newSize.height)
        detailsTextView.frame = newFrame
        print("Size")
        print(newFrame.size)
        detailsTextView.textColor = UIColor.black
       /* imageCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        ratingCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        descCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        mapCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        infoCell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        ratinView.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        infoView.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        topCell.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))*/
        
        //tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        
        /*foursquareView.innerRingColor = UIColor(red:0.13, green:0.25, blue:0.86, alpha:1)
        yelpView.innerRingColor = UIColor(red:0.83, green:0.14, blue:0.14, alpha:1)
        foursquareView.outerRingColor = UIColor.clear
        yelpView.outerRingColor = UIColor.clear
        
        foursquareView.value = (4.5 / 5) * 100
        yelpView.value = (4.1 / 5) * 100
        let rectShape = CAShapeLayer()
        rectShape.bounds = backBtn.frame
        rectShape.position = backBtn.center
        rectShape.path = UIBezierPath(roundedRect: backBtn.bounds, byRoundingCorners: [.bottomRight , .topRight], cornerRadii: CGSize(width: 20, height: 20)).cgPath
        backBtn.layer.mask = rectShape
        backBtn.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)*/
        //yelpView.backgroundColor = UIColor.white
        /*yelpView.setProgress(value: 49, animationDuration: 2.0) {
            print("Done animating!")
            // Do anything your heart desires...
        }
        foursquareView.setProgress(value: 49, animationDuration: 2.0) {
            print("Done animating!")
            // Do anything your heart desires...
        }*/
          }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
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
                return 300.0
            }
            
            if indexPath.row == 1 {
                return 220.0
            }
            if indexPath.row == 2 {
                return 1.0
            }
            
            
            if indexPath.row == 3 {
                // Will change as per size of detail textview
                let newSize = detailsTextView.sizeThatFits(CGSize(width: detailsTextView.frame.width, height: CGFloat.greatestFiniteMagnitude))
                return newSize.height + 20.0
            }
            
            if indexPath.row == 4 {
                return 200.0
            }
            
            if indexPath.row == 5 {
                return 300.0
            }
        }else{
            return 0.0
        }
        return 300
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    override func viewWillLayoutSubviews() {
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
    }

}
